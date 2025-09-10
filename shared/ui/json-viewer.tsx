"use client";

import { useEffect, useRef } from "react";

interface JsonViewerProps {
  className?: string;
  content: string;
  mode?: "json" | "text";
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  showLineNumbers?: boolean;
}

const LINE_HEIGHT_REM = 1.25;
const CHAR_WIDTH_REM = 0.5;
const PADDING_REM = 1;

export function JsonViewer({
  content,
  readOnly = false,
  showLineNumbers = false,
  placeholder = "",
  className = "",
  onChange,
  mode = "json",
}: JsonViewerProps) {
  const textareaReference = useRef<HTMLTextAreaElement>(null);
  const lineNumbersReference = useRef<HTMLDivElement>(null);

  const lines = content.split("\n");
  const totalLines = lines.length;
  const lineNumberWidth = Math.max(2, String(totalLines).length);

  useEffect(() => {
    const textarea = textareaReference.current;
    const lineNumbers = lineNumbersReference.current;

    if (!textarea || !lineNumbers || !showLineNumbers) {
      return;
    }

    const handleScroll = () => {
      lineNumbers.scrollTop = textarea.scrollTop;
    };

    textarea.addEventListener("scroll", handleScroll);
    return () => textarea.removeEventListener("scroll", handleScroll);
  }, [showLineNumbers]);

  if (mode === "text" || !showLineNumbers) {
    return (
      <textarea
        className={`h-64 w-full resize-y rounded border border-gray-300 p-3 font-mono text-sm leading-5 focus:border-blue-500 focus:outline-none ${
          readOnly ? "cursor-default bg-gray-50" : ""
        } ${className}`}
        onChange={
          readOnly ? undefined : (event) => onChange?.(event.target.value)
        }
        placeholder={placeholder}
        readOnly={readOnly}
        ref={textareaReference}
        spellCheck={false}
        value={content}
      />
    );
  }

  return (
    <div
      className={`flex h-64 resize-y overflow-hidden rounded border border-gray-300 bg-white ${className}`}
    >
      <div
        className="overflow-hidden bg-gray-50 text-right text-xs text-gray-500 select-none"
        ref={lineNumbersReference}
        style={{
          width: `calc(${lineNumberWidth} * ${CHAR_WIDTH_REM}rem + ${PADDING_REM}rem)`,
          lineHeight: `${LINE_HEIGHT_REM}rem`,
        }}
      >
        <div className="py-3 pr-2">
          {lines.map((_, index) => (
            <div
              className="font-mono"
              key={index}
              style={{ height: `${LINE_HEIGHT_REM}rem` }}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>

      <textarea
        className={`h-full flex-1 resize-none border-none p-3 font-mono text-sm leading-5 focus:outline-none ${
          readOnly ? "cursor-default bg-gray-50" : ""
        }`}
        onChange={
          readOnly ? undefined : (event) => onChange?.(event.target.value)
        }
        placeholder={placeholder}
        readOnly={readOnly}
        ref={textareaReference}
        spellCheck={false}
        value={content}
      />
    </div>
  );
}
