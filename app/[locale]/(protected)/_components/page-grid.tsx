export function PageGrid() {
  return (
    <div className="grid grid-cols-[1fr_1px_1fr] gap-x-6">
      <div
        aria-hidden
        className="bg-border-default col-start-2 row-span-full h-full w-px"
      />
    </div>
  );
}
