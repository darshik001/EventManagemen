/**
 * Date & Time Utility Helper
 * Handles parsing across different formats (ISO UTC with Z, ISO with offset, local datetime strings, timestamps)
 * ensuring consistent storage in UTC while respecting the app timezone (Asia/Kolkata +05:30).
 */

const DEFAULT_OFFSET = '+05:30';

/**
 * Parses any incoming date representation into a valid JavaScript Date object in UTC.
 * When a user provides a datetime (even if formatted with trailing 'Z', '+00:00', or without timezone),
 * the time (e.g. 16:13) represents their local appointment/task time in Indian Standard Time (Asia/Kolkata, +05:30).
 *
 * Examples:
 * - '2026-10-12T16:13:00.000Z'       -> 16:13 IST -> converts to 2026-10-12T10:43:00.000Z (UTC)
 * - '2026-10-12T16:13:00Z'           -> 16:13 IST -> converts to 2026-10-12T10:43:00.000Z (UTC)
 * - '2026-10-12T16:13:00.000+00:00'  -> 16:13 IST -> converts to 2026-10-12T10:43:00.000Z (UTC)
 * - '2026-10-12 16:13:00'            -> 16:13 IST -> converts to 2026-10-12T10:43:00.000Z (UTC)
 * - '2026-10-12T16:13:00'            -> 16:13 IST -> converts to 2026-10-12T10:43:00.000Z (UTC)
 * - '2026-10-12 16:13'               -> 16:13 IST -> converts to 2026-10-12T10:43:00.000Z (UTC)
 * - '2026-10-12T16:13:00+05:30'      -> 16:13 IST -> converts to 2026-10-12T10:43:00.000Z (UTC)
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

  // If string has explicit non-UTC offset like +05:30 or -04:00 (not Z/z or +00:00)
  const explicitNonZeroOffset = /[+-](?!00:?00)\d{2}:?\d{2}$/.test(str);
  if (explicitNonZeroOffset) {
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
      return d;
    }
  }

  // If string ends with Z/z or +00:00, strip it so the local wall-clock time
  // entered by the user (e.g. 16:13) is correctly treated as Asia/Kolkata (+05:30)
  str = str.replace(/[zZ]$/, '');
  str = str.replace(/[+-]00:?00$/, '');

  // Strip fractional seconds if any (.000)
  str = str.replace(/\.\d+$/, '');

  // Normalize space to 'T'
  str = str.replace(' ', 'T');

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    str += 'T00:00:00';
  } else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(str)) {
    // YYYY-MM-DDTHH:mm -> YYYY-MM-DDTHH:mm:00
    str += ':00';
  }

  // Append default timezone offset (+05:30)
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
