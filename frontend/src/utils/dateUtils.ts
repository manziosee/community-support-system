/**
 * Returns a human-readable relative time string (e.g. "2 hours ago", "just now")
 */
export function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;

  if (diff < minute) return 'just now';
  if (diff < hour) {
    const m = Math.floor(diff / minute);
    return `${m} ${m === 1 ? 'minute' : 'minutes'} ago`;
  }
  if (diff < day) {
    const h = Math.floor(diff / hour);
    return `${h} ${h === 1 ? 'hour' : 'hours'} ago`;
  }
  if (diff < week) {
    const d = Math.floor(diff / day);
    return `${d} ${d === 1 ? 'day' : 'days'} ago`;
  }
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Returns a short date string like "Mar 4, 2026"
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Returns greeting based on current hour
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
