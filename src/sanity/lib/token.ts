import 'server-only';

const isTest = process.env.VITEST_WORKER_ID !== undefined || process.env.NODE_ENV === 'test';

// Prefer write token (superset) if available; fall back to read token
export const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN;

if (!token && !isTest) {
  throw new Error('Missing SANITY_API_WRITE_TOKEN or SANITY_API_READ_TOKEN');
}
