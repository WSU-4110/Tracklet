import {
  endOfLocalDay,
  formatPolicyRemaining,
  fractionRemaining,
  getPolicyWindow,
  startOfLocalDay,
} from '@/lib/policyCountdown';

describe('startOfLocalDay / endOfLocalDay', () => {
  it('rejects non-ISO strings', () => {
    expect(startOfLocalDay('')).toBeNull();
    expect(startOfLocalDay('01-01-2026')).toBeNull();
    expect(endOfLocalDay('bad')).toBeNull();
  });

  it('returns start and end of the same local calendar day', () => {
    const start = startOfLocalDay('2026-03-15')!;
    const end = endOfLocalDay('2026-03-15')!;
    expect(start.getHours()).toBe(0);
    expect(start.getMinutes()).toBe(0);
    expect(end.getHours()).toBe(23);
    expect(end.getMinutes()).toBe(59);
    expect(end.getTime() - start.getTime()).toBe(24 * 60 * 60 * 1000 - 1);
  });
});

describe('getPolicyWindow', () => {
  it('returns null for invalid inputs', () => {
    expect(getPolicyWindow('', '2026-01-01', new Date())).toBeNull();
    expect(getPolicyWindow('2026-01-01', '', new Date())).toBeNull();
    expect(
      getPolicyWindow('2026-01-10', '2026-01-01', new Date()),
    ).toBeNull();
  });

  it('computes remaining time within a same-day window', () => {
    const now = new Date(2026, 5, 10, 8, 0, 0, 0);
    const w = getPolicyWindow('2026-06-10', '2026-06-10', now);
    expect(w).not.toBeNull();
    expect(w!.expired).toBe(false);
    expect(w!.remainingMs).toBeGreaterThan(0);
    expect(w!.totalMs).toBe(24 * 60 * 60 * 1000 - 1);
  });

  it('marks expired after end of deadline day', () => {
    const end = endOfLocalDay('2026-06-10')!;
    const w = getPolicyWindow(
      '2026-06-01',
      '2026-06-10',
      new Date(end.getTime() + 1),
    );
    expect(w!.expired).toBe(true);
    expect(w!.remainingMs).toBeLessThanOrEqual(0);
  });
});

describe('fractionRemaining', () => {
  it('returns 0 when expired', () => {
    const end = endOfLocalDay('2026-01-05')!;
    const w = getPolicyWindow(
      '2026-01-01',
      '2026-01-05',
      new Date(end.getTime() + 1),
    )!;
    expect(fractionRemaining(w)).toBe(0);
  });

  it('returns 1 at window start', () => {
    const start = startOfLocalDay('2026-04-01')!;
    const w = getPolicyWindow('2026-04-01', '2026-04-10', start)!;
    expect(fractionRemaining(w)).toBe(1);
  });
});

describe('formatPolicyRemaining', () => {
  it('returns Expired when window is expired', () => {
    const end = endOfLocalDay('2026-02-01')!;
    const w = getPolicyWindow(
      '2026-01-01',
      '2026-02-01',
      new Date(end.getTime() + 1),
    )!;
    expect(formatPolicyRemaining(w, '2026-02-01', new Date(end.getTime() + 1))).toBe(
      'Expired',
    );
  });

  it('returns Ends today on the deadline calendar day', () => {
    const now = new Date(2026, 7, 20, 10, 30, 0, 0);
    const w = getPolicyWindow('2026-07-01', '2026-08-20', now)!;
    expect(formatPolicyRemaining(w, '2026-08-20', now)).toBe('Ends today');
  });
});
