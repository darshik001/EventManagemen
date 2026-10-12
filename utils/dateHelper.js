/**
 * Date & Time Utility Helper
 * Handles parsing across different formats (ISO UTC, ISO with offset, local datetime strings, timestamps)
 * ensuring consistent storage in UTC while respecting the app timezone (Asia/Kolkata +05:30).
 */

const DEFAULT_OFFSET = '+05:30';

/**
 * Parses any incoming date representation into a valid JavaScript Date object in UTC.
 * - If input already includes timezone info (e.g. 'Z', '+05:30', '-04:00'), parses as-is.
 * - If input is a local string (e.g. '2026-10-12 15:30' or '2026-10-12T15:30:00'), interprets as APP_TIMEZONE (+05:30).
 * - If input is a numeric timestamp, converts directly.
 * - Returns null if invalid or missing.
 *
 * @param {string|number|Date} input
 * @param {string} [defaultOffset='+05:30']
 * @returns {Date|null}
 */
function parseDateTime(input, defaultOffset = DEFAULT_OFFSET) {
  if (input === null || input === undefined || input === '') {
    return null;
  }

  if (input instanceof Date) {
    return isNaN(input.getTime()) ? null : input;
  }

  // Numeric timestamp (e.g. 1728322800000 or "1728322800000")
  if (typeof input === 'number' || (/^\d+$/.test(String(input)) && String(input).length >= 10)) {
    const d = new Date(Number(input));
    return isNaN(d.getTime()) ? null : d;
  }

  if (typeof input !== 'string') {
    return null;
  }

  let str = input.trim();
  if (!str) return null;

  // Check if string already contains a timezone indicator:
  // Ends with Z/z or has +HH:MM, -HH:MM, +HHMM, -HHMM at the end
  const hasTimezone = /[zZ]$/.test(str) || /[+-]\d{2}(:?\d{2})?$/.test(str);
  if (hasTimezone) {
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
      return d;
    }
  }

  // Handle local formats without timezone
  // Normalize space to 'T'
  str = str.replace(' ', 'T');

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    str += 'T00:00:00';
  } else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(str)) {
    // YYYY-MM-DDTHH:mm -> YYYY-MM-DDTHH:mm:00
    str += ':00';
  }

  // Append default timezone offset
  const withOffset = new Date(str + defaultOffset);
  if (!isNaN(withOffset.getTime())) {
    return withOffset;
  }

  const fallback = new Date(input);
  return isNaN(fallback.getTime()) ? null : fallback;
}

module.exports = {
  parseDateTime,
  DEFAULT_OFFSET
};
