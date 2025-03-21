import { defineLive } from "next-sanity";
import { client } from "./client";
import { token } from "./token";

// Initialize basic Sanity Live configuration
export const { sanityFetch: baseSanityFetch, SanityLive } = defineLive({
  client,
  // Required for showing draft content when the Sanity Presentation Tool is used
  serverToken: token,
  // Required for stand-alone live previews
  browserToken: token,
});

// Define the network error type
interface NetworkError extends Error {
  isNetworkError?: boolean;
  code?: string;
}

// Create a wrapped version of sanityFetch with retry capability
export const sanityFetch = async (options: Parameters<typeof baseSanityFetch>[0]) => {
  // Set default retry options
  const maxRetries = 2;
  const baseDelay = 1000;
  
  let retries = 0;
  let lastError: NetworkError | undefined;
  
  while (retries <= maxRetries) {
    try {
      return await baseSanityFetch(options);
    } catch (error) {
      const networkError = error as NetworkError;
      lastError = networkError;
      retries++;
      
      // If we've used all retries, or it's not a network error, rethrow
      if (retries > maxRetries || 
         (!networkError.isNetworkError && 
          networkError.name !== 'AbortError' && 
          networkError.code !== 'ECONNRESET')) {
        throw error;
      }
      
      // Exponential backoff
      const delay = baseDelay * (2 ** (retries - 1));
      console.warn(`Sanity fetch retry ${retries}/${maxRetries} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  // Should never reach here, but TypeScript needs this
  throw lastError;
};
