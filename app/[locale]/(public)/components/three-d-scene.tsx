"use client";
import { AnimatePresence, motion } from "framer-motion";

import { SceneProps } from "@shared/types";

import ThreeDLayer from "@/app/[locale]/(public)/components/three-d-layer";
import {
  CONTAINER_ROTATE_X,
  CONTAINER_ROTATE_Y,
  CONTAINER_ROTATE_Z,
  DEPTH,
  INDEX_DEPTH_STEP,
  LAYER_PRESETS,
  PERSPECTIVE_ORIGIN,
  PERSPECTIVE_PX,
} from "@/shared/globals/globals-animation";

export function ThreeDScene({
  layers,
  width = "100%",
  height = 580,
}: SceneProps) {
  return (
    <div
      className="select-none"
      style={{
        width,
        height,
        position: "relative",
        perspective: `${PERSPECTIVE_PX}px`,
        perspectiveOrigin: PERSPECTIVE_ORIGIN,
      }}
    >
      <motion.div
        animate={{
          rotateX: CONTAINER_ROTATE_X,
          rotateY: CONTAINER_ROTATE_Y,
          rotateZ: CONTAINER_ROTATE_Z,
          scale: 1,
        }}
        initial={{
          rotateX: CONTAINER_ROTATE_X,
          rotateY: CONTAINER_ROTATE_Y,
          rotateZ: CONTAINER_ROTATE_Z,
          scale: 1,
        }}
        style={{ width: "100%", height: "100%", transformStyle: "preserve-3d" }}
      >
        <AnimatePresence>
          {layers.map((source, index) => {
            const baseZ = DEPTH[index] ?? index * INDEX_DEPTH_STEP;
            const preset = LAYER_PRESETS[index] ?? {};
            const z = baseZ + (preset.zAdjust ?? 0);

            return (
              <ThreeDLayer
                key={source}
                layerIndex={index}
                scaleTarget={preset.scale}
                src={source}
                startScale={preset.startScale}
                startX={preset.startX}
                startY={preset.startY}
                startZAdjust={preset.startZAdjust}
                totalLayers={layers.length}
                x={preset.x}
                y={preset.y}
                z={z}
              />
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
