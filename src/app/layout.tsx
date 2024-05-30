import "~/styles/globals.css";
import "~/styles/theme.css";
import { cookies } from "next/headers";
import { Toaster } from "react-hot-toast";
import { TRPCReactProvider } from "~/trpc/react";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/react";
import Footer from "./[lang]/_components/Footer";
import { useConfigStore } from "~/store/configStore";

const APP_NAME = "Next-push App";
const APP_DEFAULT_TITLE = "Next-push";
const APP_TITLE_TEMPLATE = "%s - PWA App";
const APP_DESCRIPTION = "push in anywhere";

export const metadata = {
  applicationName: APP_NAME,
  title: APP_DEFAULT_TITLE,
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { config } = useConfigStore.getState();
  console.log("config", config);

  return (
    <html suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="theme-zinc  bg-background  text-foreground"
      >
        <TRPCReactProvider cookies={cookies().toString()}>
          <Providers>{children}</Providers>
        </TRPCReactProvider>
        <Toaster />
        <Analytics />
        <Footer />
      </body>
    </html>
  );
}
