//http://localhost:3000/ru/main/GET?page=2&filter=name

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; method: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale, method } = await params;
  const resolvedSearchParams = (await searchParams) || {};

  return (
    <div>
      <h1>Method: {method}</h1>
      <h2>Locale: {locale}</h2>
      <pre>{JSON.stringify(resolvedSearchParams, null, 2)}</pre>
    </div>
  );
}
