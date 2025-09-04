"use client";

import { useLocalStorage } from "@utils/hooks/use-storage";
export default function DemoPage() {
  const [name, setName, reset] = useLocalStorage<string>("demo.name", "");
  return (
    <div>
      <input onChange={(error) => setName(error.target.value)} value={name} />
      <button onClick={reset}>Reset</button>
    </div>
  );
}
