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
  { weekday: 1, name: 'Monday', label: 'Evening · 6:00 PM – 12:00 PM', allDay: false, startMinutes: minutes(18), endMinutes: minutes(12) },
  { weekday: 2, name: 'Tuesday', label: 'Evening · 6:00 PM – 12:00 PM', allDay: false, startMinutes: minutes(18), endMinutes: minutes(12) },
  { weekday: 3, name: 'Wednesday', label: 'Evening · 6:00 PM – 12:00 PM', allDay: false, startMinutes: minutes(18), endMinutes: minutes(12) },
  { weekday: 4, name: 'Thursday', label: 'Evening · 6:00 PM – 12:00 PM', allDay: false, startMinutes: minutes(18), endMinutes: minutes(12) },
  { weekday: 5, name: 'Friday', label: 'Evening · 6:00 PM – 12:00 PM', allDay: false, startMinutes: minutes(18), endMinutes: minutes(12) },
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
