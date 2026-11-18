import { format, isToday, isTomorrow, isPast, formatDistanceToNow } from 'date-fns';

export function formatActivityTime(startTimeMs: number, endTimeMs?: number): string {
  const start = new Date(startTimeMs);
  let datePrefix = '';

  if (isToday(start)) {
    datePrefix = 'Today';
  } else if (isTomorrow(start)) {
    datePrefix = 'Tomorrow';
  } else {
    datePrefix = format(start, 'EEE, MMM d');
  }

  const startTimeStr = format(start, 'h:mm a');

  if (endTimeMs) {
    const end = new Date(endTimeMs);
    const endTimeStr = format(end, 'h:mm a');
    return `${datePrefix} • ${startTimeStr} – ${endTimeStr}`;
  }

  return `${datePrefix} • ${startTimeStr}`;
}

export function formatRelativeTime(timestampMs: number): string {
  const date = new Date(timestampMs);
  if (isPast(date)) {
    return `${formatDistanceToNow(date)} ago`;
  }
  return `in ${formatDistanceToNow(date)}`;
}

export function isActivityActive(startTimeMs: number, endTimeMs?: number): boolean {
  const now = Date.now();
  // If end time is provided and has passed, expired
  if (endTimeMs && now > endTimeMs) {
    return false;
  }
  // If no end time, expired after 4 hours past start time
  if (!endTimeMs && now > startTimeMs + 4 * 60 * 60 * 1000) {
    return false;
  }
  return true;
}
