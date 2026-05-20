import React from "react";
import Svg, { Path } from "react-native-svg";

type Props = {
  pars: number[];
  width: number;
  height: number;
};

const AMBER_FILL = "#FAC775";
const AMBER_STROKE = "#BA7517";
const STROKE_WIDTH = 1.5;
const VIEW_W = 100;
const VIEW_H = 40;
const PAD_TOP = 6;   // headroom above the tallest bar
const PAR_MAX = 5;   // scale ceiling (brief: bars are 1–5)

function buildPath(pars: number[]): string {
  const n = pars.length;
  if (n === 0) return "";
  const stepW = VIEW_W / n;
  const usableH = VIEW_H - PAD_TOP;

  const yFor = (par: number) => PAD_TOP + (1 - par / PAR_MAX) * usableH;

  // Start bottom-left, trace the stepped top edge, close bottom-right
  let d = `M 0 ${VIEW_H}`;
  for (let i = 0; i < n; i++) {
    const x0 = i * stepW;
    const x1 = (i + 1) * stepW;
    const y = yFor(pars[i]);
    d += ` L ${x0} ${y} L ${x1} ${y}`;
  }
  d += ` L ${VIEW_W} ${VIEW_H} Z`;
  return d;
}

export function ParProfile({ pars, width, height }: Props) {
  if (pars.length === 0) return null;
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="none"
    >
      <Path
        d={buildPath(pars)}
        fill={AMBER_FILL}
        stroke={AMBER_STROKE}
        strokeWidth={STROKE_WIDTH}
        strokeLinejoin="miter"
      />
    </Svg>
  );
}
