import { Language } from "~/components/Language";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Language />
    </>
  );
}
