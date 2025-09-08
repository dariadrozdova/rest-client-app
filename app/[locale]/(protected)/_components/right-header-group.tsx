import { getTranslations } from "next-intl/server";

export default async function RightHeaderGroup() {
  const t = await getTranslations("protected-header");
  return (
    <>
      <div className="text-text-secondary flex min-h-full items-center justify-evenly gap-4 px-6 pt-8 text-lg font-bold">
        <span className="px-2 py-1">{t("protected-header.status")}</span>
        <span className="px-2 py-1">{t("protected-header.size")}</span>
        <span className="px-2 py-1">{t("protected-header.time")}</span>
      </div>
      <div className="col-start-3 row-start-2 flex items-end px-6">
        <span className="text-text-secondary decoration-accent-blue mb-1 text-sm font-bold underline decoration-2 underline-offset-8">
          {t("protected-header.response")}
        </span>
      </div>
    </>
  );
}
