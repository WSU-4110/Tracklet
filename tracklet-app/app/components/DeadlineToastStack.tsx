'use client';

import type { DeadlineAlert } from '@/lib/deadlineAlerts';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

const VISIBLE_CAP = 5;
const DISMISS_MS = 30_000;
const FADE_MS = 500;

const weekShell =
  'border-rose-300/90 bg-rose-100/95 text-rose-950 shadow-lg shadow-rose-900/10';
const dayShell =
  'border-red-900/50 bg-red-800/95 text-white shadow-lg shadow-red-950/25';

function kindLabel(kind: DeadlineAlert['kind']): string {
  return kind === 'return' ? 'Return window' : 'Warranty';
}

function ToastCard({
  alert,
  onDismiss,
}: {
  alert: DeadlineAlert;
  onDismiss: () => void;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const dismissTimer = window.setTimeout(() => {
      setVisible(false);
    }, DISMISS_MS);
    return () => window.clearTimeout(dismissTimer);
  }, []);

  useEffect(() => {
    if (visible) return;
    const t = window.setTimeout(onDismiss, FADE_MS);
    return () => window.clearTimeout(t);
  }, [visible, onDismiss]);

  const shell = alert.urgency === 'day' ? dayShell : weekShell;

  return (
    <div
      className={`pointer-events-auto w-full max-w-sm rounded-xl border px-3 py-2.5 text-sm transition-opacity duration-500 ease-out ${shell} ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <p className="font-semibold leading-tight">{alert.itemName}</p>
      <p className="mt-0.5 text-xs opacity-90">
        {kindLabel(alert.kind)} · Due {alert.deadlineIso}
      </p>
    </div>
  );
}

export default function DeadlineToastStack({
  initialAlerts,
}: {
  initialAlerts: DeadlineAlert[];
}) {
  const capped = initialAlerts.slice(0, VISIBLE_CAP);
  const overflow = Math.max(0, initialAlerts.length - VISIBLE_CAP);

  const [dismissed, setDismissed] = useState<Set<string>>(() => new Set());

  const dismiss = useCallback((key: string) => {
    setDismissed((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  }, []);

  const visibleCards = capped.filter((a) => !dismissed.has(a.key));

  if (initialAlerts.length === 0) {
    return null;
  }

  const showRegion = visibleCards.length > 0 || overflow > 0;

  if (!showRegion) {
    return null;
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex max-h-[min(70vh,520px)] flex-col items-end gap-2 pointer-events-none sm:bottom-6 sm:right-6"
      role="status"
      aria-live="polite"
      aria-relevant="additions"
    >
      {visibleCards.map((alert) => (
        <ToastCard
          key={alert.key}
          alert={alert}
          onDismiss={() => dismiss(alert.key)}
        />
      ))}
      {overflow > 0 && (
        <p className="pointer-events-auto max-w-sm rounded-lg border border-rose-200/80 bg-white/90 px-3 py-2 text-xs font-medium text-rose-900 shadow-md backdrop-blur-sm">
          <Link
            href="/items"
            className="text-rose-800 underline-offset-2 hover:text-rose-950 hover:underline"
          >
            +{overflow} more deadline{overflow === 1 ? '' : 's'}
          </Link>
        </p>
      )}
    </div>
  );
}
