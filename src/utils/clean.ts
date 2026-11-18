/**
 * Recursively removes all undefined properties from an object
 * to prevent Firebase Realtime Database "set failed: value argument contains undefined" errors.
 */
export function sanitizeFirebasePayload<T extends Record<string, any>>(obj: T): T {
  const result: any = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) {
      continue;
    }

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = sanitizeFirebasePayload(value);
    } else {
      result[key] = value;
    }
  }

  return result;
}
