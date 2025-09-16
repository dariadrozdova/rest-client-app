//http://localhost:3000/ru/workspace/GET?page=2&filter=name

export default async function Page({
  params,
  searchParams,
}: {
  params: { locale: string; method: string };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const { locale, method } = params;
  const resolvedSearchParams = searchParams || {};

  return (
    <div>
      <h1>Method: {method}</h1>
      <h2>Locale: {locale}</h2>
      <pre>{JSON.stringify(resolvedSearchParams, null, 2)}</pre>
    </div>
  );
}
