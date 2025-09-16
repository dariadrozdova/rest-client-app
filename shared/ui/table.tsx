"use client";

import * as React from "react";

export type SimpleTableProps = React.TableHTMLAttributes<HTMLTableElement>;

const SimpleTable = React.forwardRef<HTMLTableElement, SimpleTableProps>(
  ({ className = "", children, ...props }, reference) => {
    return (
      <div className="overflow-x-auto">
        <table
          className={`w-full border border-gray-200 text-sm ${className}`}
          ref={reference}
          {...props}
        >
          {children}
        </table>
      </div>
    );
  },
);

SimpleTable.displayName = "SimpleTable";
export default SimpleTable;
