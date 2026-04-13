'use client';

import { useEffect, useState } from 'react';
import {
  fractionRemaining,
  formatPolicyRemaining,
  getPolicyWindow,
} from '@/lib/policyCountdown';

type Variant = 'amber' | 'blue';

const variantClasses: Record<
  Variant,
  { shell: string; track: string; fill: string; label: string }
> = {
  amber: {
    shell:
      'border-amber-200/50 bg-amber-100/70 text-amber-900',
    track: 'bg-amber-200/60',
    fill: 'bg-amber-500',
    label: 'text-amber-800',
  },
  blue: {
    shell:
      'border-blue-200/50 bg-blue-100/70 text-blue-900',
    track: 'bg-blue-200/60',
    fill: 'bg-blue-500',
    label: 'text-blue-800',
  },
};

type PolicyTimerProps = {
  label: string;
  purchaseDate: string;
  deadline: string;
  variant: Variant;
};

export default function PolicyTimer({
  label,
  purchaseDate,
  deadline,
  variant,
}: PolicyTimerProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const windowState = getPolicyWindow(purchaseDate, deadline, now);
  const v = variantClasses[variant];

  if (!windowState) {
    return (
      <span
        className={`inline-flex flex-col gap-1.5 min-w-[140px] max-w-full rounded-lg border px-2.5 py-1.5 text-xs ${v.shell}`}
      >
        <span className={`font-semibold ${v.label}`}>{label}</span>
        <span className="opacity-80">—</span>
      </span>
    );
  }

  const pct = fractionRemaining(windowState) * 100;
  const sub = formatPolicyRemaining(windowState, deadline, now);

  return (
    <span
      className={`inline-flex flex-col gap-1.5 min-w-[160px] max-w-full rounded-lg border px-2.5 py-1.5 text-xs ${v.shell}`}
    >
      <span className="flex items-baseline justify-between gap-2">
        <span className={`font-semibold shrink-0 ${v.label}`}>{label}</span>
        <span className="tabular-nums opacity-90 truncate" title={deadline}>
          {sub}
        </span>
      </span>
      <span
        className={`block h-1.5 w-full rounded-full overflow-hidden ${v.track}`}
        role="progressbar"
        aria-valuenow={windowState.expired ? 0 : Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label} time remaining`}
      >
        <span
          className={`block h-full rounded-full transition-[width] duration-1000 ease-linear ${v.fill}`}
          style={{ width: `${windowState.expired ? 0 : pct}%` }}
        />
      </span>
      <span className="text-[10px] opacity-75 tabular-nums">
        By {deadline}
      </span>
    </span>
  );
}
