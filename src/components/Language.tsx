"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useConfigStore } from "~/store/configStore";

export const Language = () => {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const { config } = useConfigStore();
  console.log(111);

  useEffect(() => {
    const lang = localStorage.getItem("lang");
    document.documentElement.lang = lang ?? "cn";

    if (params.lang === lang || !lang) {
      localStorage.setItem("lang", params.lang as string);

      return;
    }
    window.location.href = pathname.replace(params.lang as string, lang);
    // router.replace(pathname.replace(params.lang as string, lang));
  }, [params.lang, pathname, router]);

  return null;
};
