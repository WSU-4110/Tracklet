import { buildDeadlineAlerts, calendarDaysUntilDeadlineDay } from '@/lib/deadlineAlerts';
import type { Item } from '@/lib/items';
import { describe, expect, it } from 'vitest';

function item(partial: Partial<Item> & Pick<Item, 'id' | 'name'>): Item {
  return {
    store: null,
    purchase_date: null,
    category: null,
    price: null,
    receipt_url: null,
    return_policy_days: null,
    return_deadline: null,
    warranty_duration_months: null,
    warranty_expiration: null,
    created_at: '2026-01-01T00:00:00Z',
    ...partial,
  };
}

describe('calendarDaysUntilDeadlineDay', () => {
  it('returns 0 on deadline day', () => {
    const now = new Date(2026, 5, 10, 14, 0, 0, 0);
    expect(calendarDaysUntilDeadlineDay('2026-06-10', now)).toBe(0);
  });

  it('returns 1 when deadline is tomorrow', () => {
    const now = new Date(2026, 5, 10, 9, 0, 0, 0);
    expect(calendarDaysUntilDeadlineDay('2026-06-11', now)).toBe(1);
  });
});

describe('buildDeadlineAlerts', () => {
  it('returns empty array for no items', () => {
    expect(buildDeadlineAlerts([], new Date())).toEqual([]);
  });

  it('skips items without purchase_date', () => {
    const items = [
      item({
        id: '1',
        name: 'A',
        purchase_date: null,
        return_deadline: '2026-06-12',
      }),
    ];
    expect(buildDeadlineAlerts(items, new Date(2026, 5, 10, 12, 0, 0, 0))).toEqual([]);
  });

  it('omits expired deadlines', () => {
    const items = [
      item({
        id: '1',
        name: 'A',
        purchase_date: '2026-05-01',
        return_deadline: '2026-06-09',
      }),
    ];
    const now = new Date(2026, 5, 10, 12, 0, 0, 0);
    expect(buildDeadlineAlerts(items, now)).toEqual([]);
  });

  it('omits deadlines more than 7 calendar days away', () => {
    const items = [
      item({
        id: '1',
        name: 'A',
        purchase_date: '2026-05-01',
        return_deadline: '2026-06-20',
      }),
    ];
    const now = new Date(2026, 5, 10, 12, 0, 0, 0);
    expect(buildDeadlineAlerts(items, now)).toEqual([]);
  });

  it('uses week urgency for 2–7 days out', () => {
    const items = [
      item({
        id: '1',
        name: 'A',
        purchase_date: '2026-05-01',
        return_deadline: '2026-06-12',
      }),
    ];
    const now = new Date(2026, 5, 10, 12, 0, 0, 0);
    const alerts = buildDeadlineAlerts(items, now);
    expect(alerts).toHaveLength(1);
    expect(alerts[0]!.urgency).toBe('week');
    expect(alerts[0]!.daysUntil).toBe(2);
  });

  it('uses day urgency for today or tomorrow', () => {
    const today = new Date(2026, 5, 10, 10, 0, 0, 0);
    const itemsToday = [
      item({
        id: '1',
        name: 'TodayItem',
        purchase_date: '2026-05-01',
        return_deadline: '2026-06-10',
      }),
    ];
    expect(buildDeadlineAlerts(itemsToday, today)[0]!.urgency).toBe('day');

    const itemsTomorrow = [
      item({
        id: '2',
        name: 'TomorrowItem',
        purchase_date: '2026-05-01',
        return_deadline: '2026-06-11',
      }),
    ];
    expect(buildDeadlineAlerts(itemsTomorrow, today)[0]!.urgency).toBe('day');
  });

  it('emits separate alerts for return and warranty', () => {
    const items = [
      item({
        id: '1',
        name: 'Dual',
        purchase_date: '2026-05-01',
        return_deadline: '2026-06-11',
        warranty_expiration: '2026-06-12',
      }),
    ];
    const now = new Date(2026, 5, 10, 12, 0, 0, 0);
    const alerts = buildDeadlineAlerts(items, now);
    expect(alerts).toHaveLength(2);
    expect(alerts.map((a) => a.kind).sort()).toEqual(['return', 'warranty']);
  });

  it('sorts day-tier before week-tier, then by daysUntil', () => {
    const items = [
      item({
        id: 'w',
        name: 'Week',
        purchase_date: '2026-05-01',
        return_deadline: '2026-06-15',
      }),
      item({
        id: 'd',
        name: 'Day',
        purchase_date: '2026-05-01',
        return_deadline: '2026-06-11',
      }),
    ];
    const now = new Date(2026, 5, 10, 12, 0, 0, 0);
    const alerts = buildDeadlineAlerts(items, now);
    expect(alerts.map((a) => a.itemName)).toEqual(['Day', 'Week']);
  });
});
