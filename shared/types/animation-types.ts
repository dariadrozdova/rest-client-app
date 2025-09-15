import { HTMLAttributes } from "react";

export type ClientLogoProps = HTMLAttributes<HTMLDivElement> & {
  alt: string;
  src: string;
  vertical?: boolean;
};

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
