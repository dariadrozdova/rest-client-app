import Link from "next/link";

import { ErrorProps } from "@shared/types";

export function ErrorTemplate({ code, title, description }: ErrorProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <div className="flex flex-col items-center gap-6">
        <div className="text-[72px] font-bold text-gray-900">{code}</div>
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <p className="max-w-md text-gray-600">{description}</p>
        <Link
          className="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          href="/"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
