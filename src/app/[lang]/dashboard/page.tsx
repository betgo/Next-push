// "use client";
import React from "react";

import { useConfigStore } from "~/store/configStore";
import { getDictionary, type Locale } from "~/dictionaries";
import Content from "./content";

const Page = async ({
  params,
  searchParams,
}: {
  params: { lang: Locale };
  searchParams: Record<string, string | string[] | undefined>;
}) => {
  const dict = await getDictionary(params.lang);

  const configStore = useConfigStore.getState();
  const password = searchParams.code;
  if (password && typeof password === "string") {
    configStore.setConfig({ password });
  }

  return (
    <>
      <div className="flex h-full w-full max-w-[1200px] sm:w-5/6 sm:min-w-[600px]">
        <div className=" relative flex w-full flex-col rounded-lg border border-border bg-background pb-4  shadow-lg sm:my-8">
          <Content dict={dict} />
        </div>
      </div>
    </>
  );
};

export default Page;
