import { getTranslations } from "next-intl/server";

import { ErrorTemplate } from "@/shared/ui";

export default async function NotFound() {
  const t = await getTranslations("error-page");
  return (
    <ErrorTemplate
      code="404"
      description={t("not-found-description")}
      title={t("not-found-title")}
    />
  );
}
