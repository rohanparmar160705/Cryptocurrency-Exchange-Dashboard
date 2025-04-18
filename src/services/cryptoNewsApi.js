import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_KEYS = [
  "6624af6c37mshbb21edec74d60d1p137a77jsn1c1f2372c615", // Primary key
  "8c751654bbmshcafde997b7eb72ep194570jsnff666515903d"  // Backup key
];

let currentKeyIndex = 0;

const getNextApiKey = () => {
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return API_KEYS[currentKeyIndex];
};

const baseUrl = "https://cryptocurrency-news2.p.rapidapi.com";

const createHeaders = (apiKey) => ({
  "x-rapidapi-key": apiKey,
  "x-rapidapi-host": "cryptocurrency-news2.p.rapidapi.com",
});

export const cryptoNewsApi = createApi({
  reducerPath: "cryptoNewsApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl,
    prepareHeaders: (headers) => {
      headers.set('x-rapidapi-key', API_KEYS[currentKeyIndex]);
      headers.set('x-rapidapi-host', "cryptocurrency-news2.p.rapidapi.com");
      return headers;
    }
  }),
  endpoints: (builder) => ({
    getCryptoNews: builder.query({
      async queryFn(args, api, extraOptions, baseQuery) {
        let result = await baseQuery({
          url: `/v1/cryptodaily`,
          params: {
            q: args.newsCategory,
            limit: args.count
          }
        });

        // If first API key fails, try the backup key
        if (result.error && result.error.status === 429) {
          console.log("Primary API key exhausted, trying backup key...");
          const backupKey = getNextApiKey();
          
          result = await baseQuery({
            url: `/v1/cryptodaily`,
            params: {
              q: args.newsCategory,
              limit: args.count
            },
            headers: createHeaders(backupKey)
          });
        }

        if (result.error) {
          return { error: result.error };
        }

        // Transform the response data
        const transformedData = result.data?.data?.map((article) => ({
          name: article.title,
          url: article.url,
          image: {
            thumbnail: {
              contentUrl: article.thumbnail,
            },
          },
          datePublished: article.createdAt,
          provider: [
            {
              name: article.source,
            },
          ],
        })) || [];

        return { data: transformedData };
      },
    }),
  }),
});

export const { useGetCryptoNewsQuery } = cryptoNewsApi;
