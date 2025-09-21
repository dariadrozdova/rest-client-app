"use client";

import { useEffect, useMemo, useRef } from "react";

import { CHAR_WIDTH_REM, LINE_HEIGHT_REM, PADDING_REM } from "@/shared/globals";

interface JsonViewerProps {
  className?: string;
  compactLineNumbers?: boolean;
  content: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  showLineNumbers?: boolean;
}

export function JsonViewer({
  content,
  readOnly = false,
  showLineNumbers = false,
  placeholder = "",
  className = "",
  onChange,
  compactLineNumbers = false,
}: JsonViewerProps) {
  const textareaReference = useRef<HTMLTextAreaElement>(null);
  const lineNumbersReference = useRef<HTMLDivElement>(null);

  const COMPACT_SCALE = 0.7;
  const COMPACT_PADDING_SCALE = 0.5;

  const lines = useMemo(() => content.split("\n"), [content]);
  const lineNumberWidth = Math.max(2, String(lines.length).length);

  useEffect(() => {
    const textarea = textareaReference.current;
    const lineNumbers = lineNumbersReference.current;
    if (!textarea || !lineNumbers) {
      return;
    }

    const handleScroll = () => {
      lineNumbers.scrollTop = textarea.scrollTop;
    };

    textarea.addEventListener("scroll", handleScroll);
    return () => textarea.removeEventListener("scroll", handleScroll);
  }, []);

  const charWidth = compactLineNumbers
    ? CHAR_WIDTH_REM * COMPACT_SCALE
    : CHAR_WIDTH_REM;
  const padding = compactLineNumbers
    ? PADDING_REM * COMPACT_PADDING_SCALE
    : PADDING_REM;

  const widthRem = `calc(${lineNumberWidth} * ${charWidth}rem + ${padding}rem)`;

  return (
    <div
      className={`flex h-64 resize-y overflow-hidden rounded border border-gray-300 bg-white font-mono text-sm ${className}`}
    >
      <div
        className={`overflow-hidden bg-gray-50 text-right text-xs text-gray-500 select-none ${
          showLineNumbers ? "visible opacity-100" : "invisible opacity-0"
        } transition-opacity`}
        ref={lineNumbersReference}
        style={{
          width: widthRem,
          lineHeight: `${LINE_HEIGHT_REM}rem`,
        }}
      >
        <div className="py-3 pr-1">
          {showLineNumbers &&
            lines.map((_, index) => (
              <div key={index} style={{ height: `${LINE_HEIGHT_REM}rem` }}>
                {index + 1}
              </div>
            ))}
        </div>
      </div>

      <textarea
        className={`h-full flex-1 resize-none border-none pt-3 pr-3 pb-3 pl-2 leading-5 focus:outline-none ${
          readOnly ? "cursor-default bg-gray-50" : ""
        }`}
        onChange={
          readOnly ? undefined : (event) => onChange?.(event.target.value)
        }
        placeholder={placeholder}
        readOnly={readOnly}
        ref={textareaReference}
        spellCheck={false}
        style={{ lineHeight: `${LINE_HEIGHT_REM}rem` }}
        value={content}
      />
    </div>
  );
}
