import { ReactNode } from "react";

export function Row({
  label,
  children,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <div className="grid grid-cols-[1fr_2fr] items-center gap-4 py-3 text-sm">
      <dt className="text-gray-500">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
