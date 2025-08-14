const isTest = process.env.VITEST_WORKER_ID !== undefined || process.env.NODE_ENV === 'test';

export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-31';

export const dataset = isTest
  ? process.env.NEXT_PUBLIC_SANITY_DATASET || 'testing'
  : assertValue(
      process.env.NEXT_PUBLIC_SANITY_DATASET,
      'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
    );

export const projectId = isTest
  ? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'testing'
  : assertValue(
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
    );

export const useCdn = false;

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}
