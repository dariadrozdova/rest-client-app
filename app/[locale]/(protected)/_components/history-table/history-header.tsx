import { classNames } from "@/shared/styles";

export function HistoryHeader({
  canRerun,
  title,
  onRerun,
}: {
  canRerun: boolean;
  onRerun: () => void;
  title: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-base font-medium text-gray-700">{title}</h2>
      <button
        className={classNames(
          "bg-accent-blue border-accent-blue rounded-md border",
          "px-4 py-2 text-sm font-medium text-white",
          canRerun
            ? "cursor-pointer hover:brightness-110"
            : "cursor-not-allowed opacity-50",
        )}
        disabled={!canRerun}
        onClick={onRerun}
      >
        Rerun
      </button>
    </div>
  );
}
