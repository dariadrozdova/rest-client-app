"use client";
import { MouseEventHandler, useRef } from "react";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";

import ThreeDLayer from "@app/[locale]/(public)/components/threeDLayeer";
import {
  DEPTH,
  ENTRY_ROTATE_X,
  ENTRY_ROTATE_Y,
  ENTRY_SCALE,
  HALF,
  INDEX_DEPTH_STEP,
  MOUSE_RANGE,
  PERSPECTIVE_ORIGIN,
  PERSPECTIVE_PX,
  ROTATE_X_RANGE,
  ROTATE_Y_RANGE,
  SPRING_DAMPING,
  SPRING_STIFFNESS,
} from "@shared/globals";

interface Props {
  height?: number | string;
  layers: string[];
  width?: number | string;
}

// ---- Константы (одним блоком) ---// eslint-enable @typescript-eslint/no-magic-numbers
// ---- /Константы ----

export default function ThreeDScene({
  layers,
  width = "100%",
  height = 580,
}: Props) {
  const reference = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useTransform(my, MOUSE_RANGE, ROTATE_X_RANGE);
  const rotateY = useTransform(mx, MOUSE_RANGE, ROTATE_Y_RANGE);
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  const parallax = (index: number) => 1 - index / (layers.length * 1.2);

  const onMove: MouseEventHandler<HTMLDivElement> = (event) => {
    const r = reference.current?.getBoundingClientRect();
    if (!r) {
      return;
    }
    const nx = (event.clientX - r.left) / r.width;
    const ny = (event.clientY - r.top) / r.height;
    mx.set(nx - HALF);
    my.set(ny - HALF);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div
      className="select-none"
      onMouseLeave={onLeave}
      onMouseMove={onMove}
      ref={reference}
      style={{
        width,
        height,
        position: "relative",
        perspective: `${PERSPECTIVE_PX}px`,
        perspectiveOrigin: PERSPECTIVE_ORIGIN,
      }}
    >
      <motion.div
        animate={{ scale: 1 }} // <-- убрали rotateX/rotateY отсюда
        initial={{
          scale: ENTRY_SCALE,
          rotateX: ENTRY_ROTATE_X,
          rotateY: ENTRY_ROTATE_Y,
        }}
        style={{
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          rotateX, // MotionValue -> только в style
          rotateY, // MotionValue -> только в style
        }}
        transition={{
          type: "spring",
          damping: SPRING_DAMPING,
          stiffness: SPRING_STIFFNESS,
        }}
      >
        <AnimatePresence>
          {layers.map((source, index) => {
            const z = DEPTH[index] ?? index * INDEX_DEPTH_STEP;
            return (
              <ThreeDLayer
                k={parallax(index)}
                key={source}
                layerIndex={index} // ⬅ было index
                mx={mx.get()}
                my={my.get()}
                src={source}
                totalLayers={layers.length} // ⬅ было total
                z={z}
              />
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
