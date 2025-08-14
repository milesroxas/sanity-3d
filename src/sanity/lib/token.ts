import 'server-only';

const isTest = process.env.VITEST_WORKER_ID !== undefined || process.env.NODE_ENV === 'test';

export const token = process.env.SANITY_API_READ_TOKEN;

if (!token && !isTest) {
  throw new Error('Missing SANITY_API_READ_TOKEN');
}
