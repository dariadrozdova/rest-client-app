"use client";

import { useTranslations } from "use-intl";

import { useLocalStorage } from "@utils/hooks/use-storage";

export default function DemoPage() {
  const t = useTranslations("errors.localStorage");
  const [name, setName, reset] = useLocalStorage<string>("demo.name", "");
  return (
    <div>
      <input onChange={(error) => setName(error.target.value)} value={name} />
      <button onClick={reset}>Reset</button>
      <h1>Test errors</h1>
      <p>{t("read", { error: "SomeError", key: "demo" })}</p>
    </div>
  );
}
