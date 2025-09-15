import { ThreeDScene } from "@app/[locale]/(public)/components/three-d-scene";

import { LAYERS } from "@/shared/globals";

export default function PublicLayout() {
  return (
    <>
      <section className="relative min-h-[900px] overflow-hidden">
        <div className="relative z-10 mx-auto px-8 pt-20">
          <h1 className="w-3/5 text-7xl font-bold">Test. Debug. Repeat.</h1>
          <h3 className="text-text-secondary mt-4 w-1/2 text-2xl font-medium">
            Meet the REST client built for developers who move fast. Streamline
            API testing, debugging, and collaboration.
          </h3>
        </div>
        <div className="pointer-events-none absolute inset-0 z-0 mt-28 [height:100%] [mask-image:linear-gradient(0deg,transparent_0%,transparent_20%,white_40%,white_70%,transparent_100%)] [--h:900] [--k:calc(min(100vw/(var(--w)*1px),100dvh/(var(--h)*1px)))] [--w:1440] [perspective-origin:50%_40%] [perspective:calc(var(--k)*1000px)]">
          <div className="absolute top-1/2 left-1/2 [height:calc(var(--h)*1px)] [width:calc(var(--w)*1px)] -translate-x-1/2 -translate-y-1/2 scale-[var(--k)] transform-gpu">
            <ThreeDScene height={700} layers={LAYERS} />
          </div>
        </div>
      </section>
      <h2 className="my-8 text-5xl">Pricing</h2>
    </>
  );
}
