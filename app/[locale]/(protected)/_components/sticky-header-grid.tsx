import { LeftHeaderGroup } from "@/app/[locale]/(protected)/_components/left-header-group";
import { RightHeaderGroup } from "@/app/[locale]/(protected)/_components/right-header-group";
import { classNames } from "@/shared/styles";

export default function StickyHeaderGrid() {
  return (
    <div
      className={classNames(
        "bg-bg-primary border-border-default sticky top-0 z-30 grid " +
          "h-28 grid-cols-[1fr_1px_1fr] grid-rows-[5rem_2rem] items-start" +
          "gap-x-6 border-b",
      )}
    >
      <div
        aria-hidden
        className="bg-border-default w col-start-2 row-span-2 h-full w-px"
      />

      <LeftHeaderGroup />
      <RightHeaderGroup />
    </div>
  );
}
