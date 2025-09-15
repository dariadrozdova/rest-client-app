import { HTMLAttributes } from "react";

export type ClientLogoProps = {
  alt: string;
  src: string;
  vertical?: boolean; // true для logo-v-*.png
} & HTMLAttributes<HTMLDivElement>;

export interface LayerPreset {
  scale?: number;
  startScale?: number;
  startX?: number;
  startY?: number;
  startZAdjust?: number;
  x?: number;
  y?: number;
  zAdjust?: number;
}

export interface SceneProps {
  height?: number | string;
  layers: string[];
  width?: number | string;
}

export interface ThreeDLayerProps {
  layerIndex: number;
  scaleTarget?: number;
  src: string;
  startScale?: number;
  startX?: number;
  startY?: number;
  startZAdjust?: number;
  totalLayers: number;
  x?: number;
  y?: number;
  z: number;
}
