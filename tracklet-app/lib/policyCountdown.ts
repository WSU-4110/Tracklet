/**
 * Policy windows use calendar dates (YYYY-MM-DD). Deadlines count down to
 * end of that local day; window starts at start of purchase local day.
 */

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function startOfLocalDay(isoDate: string): Date | null {
  if (!ISO_DATE.test(isoDate)) return null;
  const [y, m, d] = isoDate.split('-').map((x) => parseInt(x, 10));
  if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return null;
  const dt = new Date(y, m - 1, d, 0, 0, 0, 0);
  if (
    dt.getFullYear() !== y ||
    dt.getMonth() !== m - 1 ||
    dt.getDate() !== d
  ) {
    return null;
  }
  return dt;
}

export function endOfLocalDay(isoDate: string): Date | null {
  if (!ISO_DATE.test(isoDate)) return null;
  const [y, m, d] = isoDate.split('-').map((x) => parseInt(x, 10));
  if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return null;
  const dt = new Date(y, m - 1, d, 23, 59, 59, 999);
  if (
    dt.getFullYear() !== y ||
    dt.getMonth() !== m - 1 ||
    dt.getDate() !== d
  ) {
    return null;
  }
  return dt;
}

export type PolicyWindow = {
  totalMs: number;
  remainingMs: number;
  expired: boolean;
};

export function getPolicyWindow(
  purchaseDate: string,
  deadline: string,
  now: Date = new Date(),
): PolicyWindow | null {
  const start = startOfLocalDay(purchaseDate);
  const end = endOfLocalDay(deadline);
  if (!start || !end) return null;
  if (end.getTime() < start.getTime()) return null;

  const totalMs = end.getTime() - start.getTime();
  if (totalMs <= 0) return null;

  const remainingMs = end.getTime() - now.getTime();
  const expired = remainingMs <= 0;
  return { totalMs, remainingMs, expired };
}

export function fractionRemaining(
  window: PolicyWindow,
): number {
  if (window.expired) return 0;
  return Math.min(1, Math.max(0, window.remainingMs / window.totalMs));
}

function sameLocalCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatPolicyRemaining(
  window: PolicyWindow,
  deadlineIso: string,
  now: Date = new Date(),
): string {
  if (window.expired) return 'Expired';

  const end = endOfLocalDay(deadlineIso);
  if (!end) return '';

  if (sameLocalCalendarDay(now, end)) {
    return 'Ends today';
  }

  const ms = window.remainingMs;
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (ms < hour) {
    const m = Math.floor(ms / minute);
    return m < 1 ? '< 1m left' : `${m}m left`;
  }

  if (ms < day) {
    const h = Math.floor(ms / hour);
    const m = Math.floor((ms % hour) / minute);
    return m > 0 ? `${h}h ${m}m left` : `${h}h left`;
  }

  if (ms < 7 * day) {
    const d = Math.floor(ms / day);
    const h = Math.floor((ms % day) / hour);
    return h > 0 ? `${d}d ${h}h left` : `${d}d left`;
  }

  const d = Math.floor(ms / day);
  return `${d}d left`;
}
