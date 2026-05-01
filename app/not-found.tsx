import { cookies, headers } from "next/headers";
import { CursorAurora } from "@/components/CursorAurora";
import { Footer } from "@/components/Footer";
import { NotFoundPage } from "@/components/NotFoundPage";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteMessagesProvider } from "@/components/SiteMessagesProvider";
import { getMessages, isLocale, localeFromAcceptLanguage } from "@/content/getMessages";

const LOCALE_COOKIE = "NEXT_LOCALE";

export default async function NotFound() {
  const [headersList, cookieStore] = await Promise.all([headers(), cookies()]);
  const headerLocale = headersList.get("x-locale") ?? "";
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value ?? "";
  const locale = isLocale(headerLocale)
    ? headerLocale
    : isLocale(cookieLocale)
      ? cookieLocale
      : localeFromAcceptLanguage(headersList.get("accept-language"));
  const messages = getMessages(locale);

  return (
    <SiteMessagesProvider messages={messages}>
      <CursorAurora />
      <div className="relative z-10 flex min-h-full flex-col">
        <SiteHeader messages={messages} />
        <NotFoundPage messages={messages} />
        <Footer messages={messages} />
      </div>
    </SiteMessagesProvider>
  );
}
