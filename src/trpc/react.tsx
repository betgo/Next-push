"use client";

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  httpLink,
  loggerLink,
  unstable_httpBatchStreamLink,
} from "@trpc/client";

import {
  createTRPCReact,
  type inferReactQueryProcedureOptions,
} from "@trpc/react-query";
import { useMemo, useState } from "react";

import { type AppRouter } from "~/server/api/root";
import { getUrl, transformer } from "./shared";
import { useConfigStore } from "~/store/configStore";
import { getHeaders } from "~/shared/headers";
import toast from "react-hot-toast";
import { ResponseCode, UNAUTHORIZED } from "~/shared/constant";

export const trpc = createTRPCReact<AppRouter>();

export function TRPCReactProvider(props: {
  children: React.ReactNode;
  cookies: string;
}) {
  const configStore = useConfigStore.getState();
  const iscn =
    typeof window !== "undefined"
      ? window.localStorage?.getItem("lang") === "cn"
      : false;

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },

        queryCache: new QueryCache({
          onError: (error, query) => {
            if (error.message === UNAUTHORIZED) {
              toast.error(
                iscn
                  ? ResponseCode.cn[UNAUTHORIZED].message
                  : ResponseCode[UNAUTHORIZED].message,
              );
              configStore.setIsAuth(false);
            } else {
              toast.error(error.message);
            }
          },
          onSuccess: () => {
            configStore.setIsAuth(true);
          },
        }),
        mutationCache: new MutationCache({
          onError: (error, query) => {
            if (error.message === UNAUTHORIZED) {
              toast.error(
                iscn
                  ? ResponseCode.cn[UNAUTHORIZED].message
                  : ResponseCode[UNAUTHORIZED].message,
              );
              configStore.setIsAuth(false);
            } else {
              toast.error(error.message);
            }
          },
          onSuccess: () => {
            configStore.setIsAuth(true);
          },
        }),
      }),
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        httpLink({
          url: getUrl(),
          headers: () => {
            const headers = getHeaders();

            return {
              cookie: props.cookies,
              "x-trpc-source": "react",
              ...headers,
            };
          },

          transformer,
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </trpc.Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
