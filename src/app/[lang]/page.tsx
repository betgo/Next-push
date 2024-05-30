import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { locales, type Locale } from "~/dictionaries";

export default function Home({ params }: { params: { lang: Locale } }) {
  if (locales.includes(params.lang)) {
    redirect(`/${params.lang}/dashboard`);
  }else{
    notFound()
  }

  // return <Link href="/dashboard">Dashboard</Link>;
}
