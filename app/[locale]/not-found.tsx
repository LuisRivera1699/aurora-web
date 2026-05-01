import { headers } from "next/headers";
import { Footer } from "@/components/Footer";
import { NotFoundPage } from "@/components/NotFoundPage";
import { SiteHeader } from "@/components/SiteHeader";
import { getMessages, isLocale } from "@/content/getMessages";

export default async function LocaleNotFound() {
  const headersList = await headers();
  const headerLocale = headersList.get("x-locale") ?? "";
  const locale = isLocale(headerLocale) ? headerLocale : "es";
  const messages = getMessages(locale);

  return (
    <>
      <SiteHeader messages={messages} />
      <NotFoundPage messages={messages} />
      <Footer messages={messages} />
    </>
  );
}
