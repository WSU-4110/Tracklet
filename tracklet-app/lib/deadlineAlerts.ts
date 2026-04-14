import type { Item } from '@/lib/items';
import { endOfLocalDay, getPolicyWindow, startOfLocalDay } from '@/lib/policyCountdown';

export type DeadlineAlertUrgency = 'week' | 'day';

export type DeadlineAlert = {
  key: string;
  itemName: string;
  kind: 'return' | 'warranty';
  deadlineIso: string;
  urgency: DeadlineAlertUrgency;
  /** Calendar days from start of today to start of deadline day (0 = due today). */
  daysUntil: number;
};

function startOfTodayLocal(now: Date): Date {
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0,
  );
}

/** Whole calendar days from start of today to start of deadline day (local). */
export function calendarDaysUntilDeadlineDay(
  deadlineIso: string,
  now: Date,
): number | null {
  const deadlineStart = startOfLocalDay(deadlineIso);
  if (!deadlineStart) return null;
  const todayStart = startOfTodayLocal(now);
  return Math.round(
    (deadlineStart.getTime() - todayStart.getTime()) / (24 * 60 * 60 * 1000),
  );
}

function evaluatePolicy(
  item: Item,
  kind: 'return' | 'warranty',
  purchaseDate: string,
  deadline: string | null,
  now: Date,
): DeadlineAlert | null {
  if (!deadline) return null;

  const windowState = getPolicyWindow(purchaseDate, deadline, now);
  if (!windowState || windowState.expired) return null;

  const daysUntil = calendarDaysUntilDeadlineDay(deadline, now);
  if (daysUntil === null || daysUntil < 0) return null;
  if (daysUntil > 7) return null;

  let urgency: DeadlineAlertUrgency;
  if (daysUntil <= 1) {
    urgency = 'day';
  } else {
    urgency = 'week';
  }

  return {
    key: `${item.id}-${kind}`,
    itemName: item.name,
    kind,
    deadlineIso: deadline,
    urgency,
    daysUntil,
  };
}

export function buildDeadlineAlerts(
  items: Item[],
  now: Date = new Date(),
): DeadlineAlert[] {
  const out: DeadlineAlert[] = [];

  for (const item of items) {
    const purchase = item.purchase_date;
    if (!purchase) continue;

    const ret = evaluatePolicy(
      item,
      'return',
      purchase,
      item.return_deadline,
      now,
    );
    if (ret) out.push(ret);

    const war = evaluatePolicy(
      item,
      'warranty',
      purchase,
      item.warranty_expiration,
      now,
    );
    if (war) out.push(war);
  }

  out.sort((a, b) => {
    const ua = a.urgency === 'day' ? 0 : 1;
    const ub = b.urgency === 'day' ? 0 : 1;
    if (ua !== ub) return ua - ub;
    if (a.daysUntil !== b.daysUntil) return a.daysUntil - b.daysUntil;
    return a.itemName.localeCompare(b.itemName);
  });

  return out;
}
