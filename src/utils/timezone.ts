export interface TimezoneOption {
  label: string;
  tz: string;
  offset: string;
}

export const CURATED_TIMEZONES: TimezoneOption[] = [
  { label: 'Philippine Standard Time (PST / UTC+8)', tz: 'Asia/Manila', offset: 'UTC+8' },
  { label: 'Japan Standard Time (JST / UTC+9)', tz: 'Asia/Tokyo', offset: 'UTC+9' },
  { label: 'Australian Eastern Time (AEST / UTC+10)', tz: 'Australia/Sydney', offset: 'UTC+10' },
  { label: 'Gulf Standard Time (GST / UTC+4)', tz: 'Asia/Dubai', offset: 'UTC+4' },
  { label: 'Central European Time (CET / UTC+1)', tz: 'Europe/Paris', offset: 'UTC+1' },
  { label: 'London / GMT / BST (UTC+0)', tz: 'Europe/London', offset: 'UTC+0' },
  { label: 'US Eastern Time (EST / UTC-5)', tz: 'America/New_York', offset: 'UTC-5' },
  { label: 'US Central Time (CST / UTC-6)', tz: 'America/Chicago', offset: 'UTC-6' },
  { label: 'US Mountain Time (MST / UTC-7)', tz: 'America/Denver', offset: 'UTC-7' },
  { label: 'US Pacific Time (PST / UTC-8)', tz: 'America/Los_Angeles', offset: 'UTC-8' },
  { label: 'Brazil Time (BRT / UTC-3)', tz: 'America/Sao_Paulo', offset: 'UTC-3' },
];

export const getDetectedTimezone = (): string => {
  try {
    const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const match = CURATED_TIMEZONES.find((t) => t.tz === userTz);
    if (match) return match.tz;
    return userTz || 'Asia/Manila';
  } catch {
    return 'Asia/Manila';
  }
};

export const convertTimezoneSlot = (
  dateStr: string, // YYYY-MM-DD
  time24: string,  // HH:mm
  targetTz: string // IANA timezone string
): { localLabel: string; utc8Label: string } => {
  try {
    const isoStr = `${dateStr}T${time24.length === 5 ? time24 : `${time24}:00`}:00+08:00`;
    const dateObj = new Date(isoStr);

    if (isNaN(dateObj.getTime())) {
      return { localLabel: time24, utc8Label: time24 };
    }

    const localLabel = dateObj.toLocaleTimeString('en-US', {
      timeZone: targetTz,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const utc8Label = dateObj.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Manila',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    return { localLabel, utc8Label };
  } catch (err) {
    return { localLabel: time24, utc8Label: time24 };
  }
};
