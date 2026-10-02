export const SESSION_TIMEZONE = 'Asia/Kolkata';

export type SessionDay = {
  weekday: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  name: string;
  label: string;
  allDay: boolean;
  startMinutes: number;
  endMinutes: number;
};

const minutes = (hour: number, min = 0) => hour * 60 + min;

export const SESSION_DAYS: SessionDay[] = [
  { weekday: 0, name: 'Sunday', label: '24 hours', allDay: true, startMinutes: 0, endMinutes: 24 * 60 },
  { weekday: 1, name: 'Monday', label: '7:00 PM – 12:00 AM', allDay: false, startMinutes: minutes(19), endMinutes: 24 * 60 },
  { weekday: 2, name: 'Tuesday', label: '7:00 PM – 12:00 AM', allDay: false, startMinutes: minutes(19), endMinutes: 24 * 60 },
  { weekday: 3, name: 'Wednesday', label: '7:00 PM – 12:00 AM', allDay: false, startMinutes: minutes(19), endMinutes: 24 * 60 },
  { weekday: 4, name: 'Thursday', label: '7:00 PM – 12:00 AM', allDay: false, startMinutes: minutes(19), endMinutes: 24 * 60 },
  { weekday: 5, name: 'Friday', label: '7:00 PM – 12:00 AM', allDay: false, startMinutes: minutes(19), endMinutes: 24 * 60 },
  { weekday: 6, name: 'Saturday', label: '24 hours', allDay: true, startMinutes: 0, endMinutes: 24 * 60 },
];

const WEEKDAY_INDEX: Record<string, SessionDay['weekday']> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export function getIstClock(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: SESSION_TIMEZONE,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);

  const weekdayName = parts.find((part) => part.type === 'weekday')?.value ?? 'Sun';
  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? '0');
  const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? '0');
  const weekday = WEEKDAY_INDEX[weekdayName] ?? 0;

  return { weekday, hour, minute, minutes: hour * 60 + minute };
}

export function isWithinSession(day: SessionDay, clockMinutes: number) {
  if (day.allDay) return true;
  if (day.endMinutes > day.startMinutes) {
    return clockMinutes >= day.startMinutes && clockMinutes < day.endMinutes;
  }
  return clockMinutes >= day.startMinutes || clockMinutes < day.endMinutes;
}

export function getTodaySession(date = new Date()) {
  const clock = getIstClock(date);
  const day = SESSION_DAYS.find((item) => item.weekday === clock.weekday) ?? SESSION_DAYS[0];
  const open = isWithinSession(day, clock.minutes);
  return { ...day, open, clock };
}

export function isSlotWithinService(date: Date): boolean {
  const clock = getIstClock(date);
  const day = SESSION_DAYS.find((item) => item.weekday === clock.weekday) ?? SESSION_DAYS[0];
  return isWithinSession(day, clock.minutes);
}

export function formatScheduledIst(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: SESSION_TIMEZONE,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d);
}

function formatClock(totalMinutes: number) {
  const hour24 = Math.floor(totalMinutes / 60) % 24;
  const minute = totalMinutes % 60;
  const suffix = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, '0')} ${suffix}`;
}

export function getNextHopCopy(date = new Date()) {
  const session = getTodaySession(date);
  if (session.open) return null;
  const time = formatClock(session.startMinutes);
  return {
    headline: session.name,
    time,
    label: session.label,
    message: `We open at ${time} IST (${session.label}).`,
  };
}

export function serviceHoursSummary(): string {
  return 'Mon–Fri 7 PM–12 AM · Sat–Sun 24 hours';
}

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

export function toDatetimeLocalValue(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}T${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

export function scheduleInputBounds() {
  const min = new Date(Date.now() + 30 * 60 * 1000);
  const max = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  return { min: toDatetimeLocalValue(min), max: toDatetimeLocalValue(max) };
}

export function canPlaceOrderNow(deliveryTiming: 'asap' | 'scheduled', scheduledAt: string | null): boolean {
  if (deliveryTiming === 'scheduled' && scheduledAt) {
    const when = new Date(scheduledAt);
    if (Number.isNaN(when.getTime())) return false;
    return isSlotWithinService(when);
  }
  return getTodaySession().open;
}
