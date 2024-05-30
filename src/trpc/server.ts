import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { cookies } from "next/headers";

import { type AppRouter } from "~/server/api/root";
import { getUrl, transformer } from "./shared";

export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        httpBatchLink({
          /**
           * If you want to use SSR, you need to use the server's full URL
           * @link https://trpc.io/docs/v11/ssr
           **/
          url: getUrl(),
          // You can pass any HTTP headers you wish here
          // async headers() {
          //   return {
          //     // authorization: getAuthCookie(),
          //   };
          // },
          transformer,
        }),
      ],
    };
  },
  transformer,
});
