//http://localhost:3000/ru/main/GET?page=2&filter=name

"use client";

interface PageProps {
  params: { locale: string; method: string };
  searchParams: Record<string, string | string[] | undefined>;
}

export default function Page({ params, searchParams }: PageProps) {
  return (
    <div>
      <h1>Method: {params.method}</h1>
      <h2>Locale: {params.locale}</h2>

      <pre>{JSON.stringify(searchParams, null, 2)}</pre>
    </div>
  );
}
