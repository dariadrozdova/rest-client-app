"use client";
import { motion } from "framer-motion";

import { ThreeDLayerProps } from "@shared/types";

import {
  LANDING_Z_OFFSET,
  LAYER_APPEAR_DURATION,
  LAYER_SCALE_COEF,
} from "@/shared/globals/globals-animation";

export default function ThreeDLayer({
  src,
  layerIndex,
  z,
  x = 0,
  y = 0,
  scaleTarget = 1,
  startX,
  startY,
  startScale,
  startZAdjust,
}: ThreeDLayerProps) {
  const computedStartZ = z + LANDING_Z_OFFSET;
  const startZ = startZAdjust === undefined ? computedStartZ : z + startZAdjust;

  return (
    <motion.img
      alt={`layer-${layerIndex}`}
      animate={{ opacity: 1, z, x, y, scale: scaleTarget }}
      draggable={false}
      exit={{ opacity: 0 }}
      initial={{
        opacity: 0,
        z: startZ,
        x: startX ?? x,
        y: startY ?? y,
        scale: startScale ?? scaleTarget * LAYER_SCALE_COEF,
      }}
      src={src}
      style={{
        position: "absolute",
        inset: 0,
        objectFit: "cover",
        transformStyle: "preserve-3d",
        zIndex: Math.round(z),
        willChange: "transform, opacity",
      }}
      transition={{
        duration: LAYER_APPEAR_DURATION,
        delay: 0,
        ease: "easeOut",
      }}
    />
  );
}
