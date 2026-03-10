import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { timeAgo, formatDate, getGreeting } from '../utils/dateUtils';

describe('timeAgo', () => {
  it('returns "just now" for recent timestamps', () => {
    const now = new Date().toISOString();
    expect(timeAgo(now)).toBe('just now');
  });

  it('returns minutes ago for timestamps < 1 hour', () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    expect(timeAgo(fiveMinutesAgo)).toBe('5 minutes ago');
  });

  it('returns singular minute for 1 minute ago', () => {
    const oneMinuteAgo = new Date(Date.now() - 61 * 1000).toISOString();
    expect(timeAgo(oneMinuteAgo)).toBe('1 minute ago');
  });

  it('returns hours ago for timestamps < 1 day', () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
    expect(timeAgo(threeHoursAgo)).toBe('3 hours ago');
  });

  it('returns days ago for timestamps < 1 week', () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
    expect(timeAgo(twoDaysAgo)).toBe('2 days ago');
  });

  it('returns a formatted date string for old timestamps', () => {
    const old = '2020-01-15T00:00:00.000Z';
    const result = timeAgo(old);
    expect(result).toMatch(/Jan/);
    expect(result).toMatch(/2020/);
  });
});

describe('formatDate', () => {
  it('formats a date string as "Mon D, YYYY"', () => {
    const result = formatDate('2026-03-10T12:00:00.000Z');
    expect(result).toMatch(/Mar/);
    expect(result).toMatch(/2026/);
  });
});

describe('getGreeting', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('returns Good morning before noon', () => {
    vi.setSystemTime(new Date('2026-03-10T08:00:00'));
    expect(getGreeting()).toBe('Good morning');
  });

  it('returns Good afternoon from 12:00 to 16:59', () => {
    vi.setSystemTime(new Date('2026-03-10T14:00:00'));
    expect(getGreeting()).toBe('Good afternoon');
  });

  it('returns Good evening from 17:00', () => {
    vi.setSystemTime(new Date('2026-03-10T19:00:00'));
    expect(getGreeting()).toBe('Good evening');
  });
});
