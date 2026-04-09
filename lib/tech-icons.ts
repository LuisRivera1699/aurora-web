import type { SimpleIcon } from "simple-icons";
import {
  siAngular,
  siCss,
  siDigitalocean,
  siDotnet,
  siEthereum,
  siFirebase,
  siFigma,
  siFlutter,
  siHtml5,
  siJavascript,
  siKotlin,
  siMongodb,
  siNextdotjs,
  siNodedotjs,
  siPolygon,
  siPython,
  siReact,
  siSolidity,
  siSwift,
} from "simple-icons";

/** Brands not shipped in simple-icons — neutral monogram badges (no third-party logos). */
export type TechFallback = {
  kind: "fallback";
  abbr: string;
  color: string;
};

export type TechGlyph = { kind: "icon"; icon: SimpleIcon } | TechFallback;

const FALLBACKS: Record<string, TechFallback> = {
  aws: { kind: "fallback", abbr: "AWS", color: "#FF9900" },
  azure: { kind: "fallback", abbr: "Az", color: "#0078D4" },
  openai: { kind: "fallback", abbr: "AI", color: "#10A37F" },
};

const ICONS: Record<string, SimpleIcon> = {
  figma: siFigma,
  react: siReact,
  nextdotjs: siNextdotjs,
  angular: siAngular,
  html5: siHtml5,
  css: siCss,
  javascript: siJavascript,
  flutter: siFlutter,
  swift: siSwift,
  kotlin: siKotlin,
  nodedotjs: siNodedotjs,
  dotnet: siDotnet,
  python: siPython,
  mongodb: siMongodb,
  firebase: siFirebase,
  digitalocean: siDigitalocean,
  solidity: siSolidity,
  ethereum: siEthereum,
  polygon: siPolygon,
};

export function getTechGlyph(id: string): TechGlyph {
  const fb = FALLBACKS[id];
  if (fb) return fb;
  const icon = ICONS[id];
  if (icon) return { kind: "icon", icon };
  return { kind: "fallback", abbr: id.slice(0, 2).toUpperCase(), color: "#8888aa" };
}
