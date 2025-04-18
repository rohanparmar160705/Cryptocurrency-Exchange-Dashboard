/* eslint-disable no-unused-vars */
/**
 * This file sets up the API service for fetching cryptocurrency data using Redux Toolkit Query
 * and the CoinRanking API from RapidAPI.
 */

// Import necessary functions from Redux Toolkit Query
// createApi: Creates an API service
// fetchBaseQuery: Creates a base query function for making HTTP requests
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * Base URL for the CoinRanking API
 * This is the root endpoint for all API requests
 */
const baseUrl = "https://coinranking1.p.rapidapi.com";

/**
 * API Headers Configuration
 * These headers are required for authentication with the RapidAPI service
 * x-rapidapi-key: Your unique API key from RapidAPI
 * x-rapidapi-host: The specific API host you're accessing
 */
const cryptoApiHeaders = {
  "x-rapidapi-key": "6624af6c37mshbb21edec74d60d1p137a77jsn1c1f2372c615",
  "x-rapidapi-host": "coinranking1.p.rapidapi.com"
};

/**
 * Helper function to create a request object
 * @param {string} url - The API endpoint to call
 * @returns {Object} - Request configuration object with URL and headers
 */
const createRequest = (url) => ({ 
  url, 
  headers: cryptoApiHeaders
});

/**
 * Create and export the crypto API service
 * This sets up the Redux Toolkit Query API service with:
 * - A unique reducer path for the Redux store
 * - Base query configuration
 * - API endpoints
 */
export const cryptoApi = createApi({
  // Unique identifier for this API slice in the Redux store
  reducerPath: "cryptoApi",

  // Configure the base query with custom header preparation
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: async (headers) => {
      headers.set('x-rapidapi-key', cryptoApiHeaders['x-rapidapi-key']);
      headers.set('x-rapidapi-host', cryptoApiHeaders['x-rapidapi-host']);
      return headers;
    },
  }),

  // Configure default cache behavior
  keepUnusedDataFor: 3600, // Keep unused data for 1 hour
  refetchOnMountOrArgChange: true, // Enable refetch on mount
  refetchOnFocus: false, // Don't refetch when window regains focus
  refetchOnReconnect: true, // Enable refetch on reconnect

  // Define the available API endpoints
  endpoints: (builder) => ({
    /**
     * Endpoint to fetch cryptocurrency data
     * This creates a query hook that can be used in components as: useGetCryptosQuery()
     *
     * Features:
     * - Uses the /coins endpoint to fetch cryptocurrency data
     * - Includes response transformation for logging
     * - Includes error transformation for debugging
     */
    getCryptos: builder.query({
      async queryFn(count, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          const response = await fetchWithBQ(`/coins?limit=${count}`);
          if (response.error) throw response.error;
          return { 
            data: {
              data: response.data.data,
              timestamp: Date.now()
            }
          };
        } catch (error) {
          console.error("Crypto API Error:", error);
          return { 
            error: {
              status: error.status || 500,
              data: error.data || "Failed to fetch crypto data"
            }
          };
        }
      },
      keepUnusedDataFor: 3600,
    }),

    getGlobalStats: builder.query({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          const response = await fetchWithBQ("/stats");
          if (response.error) throw response.error;
          return { 
            data: {
              data: response.data.data,
              timestamp: Date.now()
            }
          };
        } catch (error) {
          console.error("Global Stats API Error:", error);
          return { 
            error: {
              status: error.status || 500,
              data: error.data || "Failed to fetch global stats"
            }
          };
        }
      },
      keepUnusedDataFor: 3600,
    }),

    getCryptoDetails: builder.query({
      async queryFn(coinId, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          const response = await fetchWithBQ(`/coin/${coinId}`);
          if (response.error) throw response.error;
          return { 
            data: {
              data: response.data.data,
              timestamp: Date.now()
            }
          };
        } catch (error) {
          console.error("Crypto Details API Error:", error);
          return { 
            error: {
              status: error.status || 500,
              data: error.data || "Failed to fetch crypto details"
            }
          };
        }
      }
    }),

    getCryptoHistory: builder.query({
      async queryFn({ coinId, timePeriod }, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          const response = await fetchWithBQ(`/coin/${coinId}/history?timePeriod=${timePeriod}`);
          if (response.error) throw response.error;
          return { 
            data: {
              data: response.data.data,
              timestamp: Date.now()
            }
          };
        } catch (error) {
          console.error("Crypto History API Error:", error);
          return { 
            error: {
              status: error.status || 500,
              data: error.data || "Failed to fetch crypto history"
            }
          };
        }
      }
    }),

    getExchanges: builder.query({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          const response = await fetchWithBQ("/exchanges");
          if (response.error) throw response.error;
          return { data: response.data };
        } catch (error) {
          console.error("Exchanges API Error:", error);
          return { 
            error: {
              status: error.status || 500,
              data: error.data || "Failed to fetch exchanges"
            }
          };
        }
      }
    }),
  }),
});

export const {
  useGetCryptosQuery,
  useGetGlobalStatsQuery,
  useGetCryptoDetailsQuery,
  useGetCryptoHistoryQuery,
  useGetExchangesQuery,
} = cryptoApi;


