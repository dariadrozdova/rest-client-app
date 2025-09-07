"use client";

import { FormEvent, useState } from "react";
import { useLocale } from "next-intl";

export default function RequestPage() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("https://rickandmortyapi.com/api/character");
  const [body, setBody] = useState("");
  const [responseText, setResponseText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const locale = useLocale();

  const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];

  const methodAllowsBody = !["DELETE", "GET"].includes(method);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResponseText("");

    const data = { body, methods, url };

    try {
      setIsLoading(true);

      const response = await fetch(`/${locale}/api/main`, {
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      const text = JSON.stringify(await response.json(), null, 2);
      setResponseText(`${response.status} ${response.statusText}\n\n${text}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (caughtError: unknown) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : String(caughtError);
      setError(message || "Request error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold">Rick &amp; Morty API Request</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Method</label>
          <select
            className="w-full rounded border px-3 py-2"
            onChange={(event) => setMethod(event.target.value)}
            value={method}
          >
            {methods.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Endpoint</label>
          <input
            className="w-full rounded border px-3 py-2"
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://rickandmortyapi.com/api/character?page=2"
            type="text"
            value={url}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Request Body{" "}
            {methodAllowsBody ? "" : "(не используется для этого метода)"}
          </label>
          <textarea
            className="min-h-[100px] w-full rounded border px-3 py-2"
            disabled={!methodAllowsBody}
            onChange={(event) => setBody(event.target.value)}
            placeholder='{"name":"Rick"}'
            value={body}
          />
        </div>

        <button
          className="w-full rounded bg-blue-600 py-2 text-white disabled:opacity-60"
          disabled={isLoading || !url}
        >
          Send Request
        </button>
      </form>

      <div className="space-y-2">
        <h2 className="text-xl font-medium">Response</h2>
        <textarea
          className="min-h-[240px] w-full rounded border bg-gray-50 px-3 py-2 font-mono text-sm"
          placeholder="Response will appear here"
          readOnly
          value={responseText}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
