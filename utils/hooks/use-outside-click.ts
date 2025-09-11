import { RefObject, useEffect } from "react";

export function useOutsideClick(
  reference: RefObject<HTMLElement | null>,
  callback: () => void,
  isActive = true,
) {
  useEffect(() => {
    if (!isActive) {
      return;
    }

    function handleClickOutside(event: MouseEvent) {
      if (
        reference.current &&
        event.target instanceof Node &&
        !reference.current.contains(event.target)
      ) {
        callback();
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        callback();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [reference, callback, isActive]);
}
