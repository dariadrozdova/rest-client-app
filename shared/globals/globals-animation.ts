import {
  appControls,
  appWindow,
  backgroundLine,
  browserControls,
  favorites,
  inputLine,
  logoName,
  projects,
  requestHist,
  requestTabs,
  responsePanel,
  teams,
} from "@app/[locale]/(public)/images";
import {
  logoBand,
  logoCamp,
  logoCar,
  logoChurch,
  logoDiner,
  logoHotel,
  logoMarket,
  logoPrimary,
  logoPub,
  logoSchool,
  logoTatar,
  logoTravel,
  logoVChoir,
  logoVCircus,
  logoVFishermen,
  logoVSumo,
} from "@app/[locale]/(public)/images";
import { LayerPreset } from "@shared/types/animation-types";

export const PERSPECTIVE_PX = 1000;
export const PERSPECTIVE_ORIGIN = "30% 40%";

export const CONTAINER_ROTATE_X = 30;
export const CONTAINER_ROTATE_Y = 15;
export const CONTAINER_ROTATE_Z = -25;

export const LAYER_APPEAR_DURATION = 0.6;
export const LANDING_Z_OFFSET = 40;
export const LAYER_SCALE_COEF = 1.01;

export const DEPTH_BACKGROUND = -200;
export const DEPTH_LAYER1 = 20;
export const DEPTH_LAYER2 = 45;
export const DEPTH_LAYER3 = 70;
export const DEPTH_LAYER4 = 95;
export const DEPTH_LAYER5 = 120;
export const DEPTH_LAYER6 = 150;
export const DEPTH_LAYER7 = 180;
export const DEPTH_LAYER8 = 210;
export const DEPTH_LAYER9 = 245;
export const DEPTH_LAYER10 = 280;
export const DEPTH_LAYER11 = 320;
export const DEPTH_FOREGROUND = 360;

export const DEPTH: number[] = [
  DEPTH_BACKGROUND,
  DEPTH_LAYER1,
  DEPTH_LAYER2,
  DEPTH_LAYER3,
  DEPTH_LAYER4,
  DEPTH_LAYER5,
  DEPTH_LAYER6,
  DEPTH_LAYER7,
  DEPTH_LAYER8,
  DEPTH_LAYER9,
  DEPTH_LAYER10,
  DEPTH_LAYER11,
  DEPTH_FOREGROUND,
];

export const INDEX_DEPTH_STEP = 30;

export const LAYERS: string[] = [
  backgroundLine.src,
  appWindow.src,
  browserControls.src,
  appControls.src,
  favorites.src,
  teams.src,
  projects.src,
  inputLine.src,
  logoName.src,
  requestHist.src,
  responsePanel.src,
  requestTabs.src,
];

export const LAYER_PRESETS: LayerPreset[] = [
  { scale: 2.5, x: 1050, y: 200, zAdjust: -40 },
  { scale: 1.93, x: 600, y: 190, zAdjust: -20 },
  { scale: 0.6, x: -55, y: -160 },
  { scale: 0.55, x: -70, y: -30 },
  { scale: 0.55, x: -45, y: 85 },
  { scale: 0.5, x: -65, y: 300 },
  { scale: 0.47, x: -85, y: 650 },
  { scale: 0.62, x: 10, y: 110 },
  { scale: 0.55, x: 190, y: 10 },
  { scale: 0.55, x: -63, y: 105 },
  { scale: 0.55, x: 800, y: -15 },
  { scale: 0.5, x: -46, y: 248 },
];

export const GROUPS = [
  {
    key: "group-a",
    layout: "2x3",
    items: [
      { src: logoBand.src, alt: "Band" },
      { src: logoCamp.src, alt: "Camp" },
      { src: logoCar.src, alt: "Car" },
      { src: logoChurch.src, alt: "Church" },
      { src: logoTatar.src, alt: "Tatar" },
      { src: logoTravel.src, alt: "Travel" },
    ],
  },
  {
    key: "group-b",
    layout: "2x3",
    items: [
      { src: logoMarket.src, alt: "Market" },
      { src: logoPrimary.src, alt: "Primary" },
      { src: logoPub.src, alt: "Pub" },
      { src: logoSchool.src, alt: "School" },
      { src: logoDiner.src, alt: "Diner" },
      { src: logoHotel.src, alt: "Hotel" },
    ],
  },
  {
    key: "group-c",
    layout: "1x4",
    items: [
      { src: logoVChoir.src, alt: "Choir", kind: "vertical" },
      { src: logoVCircus.src, alt: "Circus", kind: "vertical" },
      { src: logoVFishermen.src, alt: "Fishermen", kind: "vertical" },
      { src: logoVSumo.src, alt: "Sumo", kind: "vertical" },
    ],
  },
];

export const SHOWCASE_DEFAULTS = {
  intervalMs: 5000,
  transitionMs: 700,
} as const;
