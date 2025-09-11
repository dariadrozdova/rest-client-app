"use client";

import { useDispatch, useSelector } from "react-redux";

import { setSelectedMethod } from "@store/slices/method-slice";
import { RootState } from "@store/store";

import { HTTP_METHODS } from "@/shared/globals";
import { Dropdown } from "@/shared/ui/dropdown";

export function MethodSwitch() {
  const dispatch = useDispatch();
  const selected = useSelector(
    (state: RootState) => state.method.selectedMethod,
  );

  const methodOptions = HTTP_METHODS.map((method) => ({
    value: method,
    label: method,
  }));

  const handleSelect = (method: string) => {
    const foundMethod = HTTP_METHODS.find(
      (httpMethod) => httpMethod === method,
    );
    if (foundMethod) {
      dispatch(setSelectedMethod(foundMethod));
    }
  };

  return (
    <div className="relative text-base" data-current-method={selected}>
      <Dropdown
        ariaLabel="Select HTTP method"
        buttonClassName="bg-bg-secondary text-text-secondary border-border-default h-9 w-20 border rounded-l-md px-2 py-1 font-medium"
        dropdownClassName="bg-bg-secondary"
        onSelect={handleSelect}
        options={methodOptions}
        selectedValue={selected}
        width="w-40"
      />
    </div>
  );
}
