import { Link } from "@shared/lib/i18n/navigation";

export function HistoryEmptyState() {
  return (
    <div className="rounded-xl border p-6 text-sm">
      <p className="mb-2">History is empty.</p>
      <p className="mb-2">Create new request</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <Link className="underline" href="/rest">
            Client
          </Link>
        </li>
      </ul>
    </div>
  );
}
