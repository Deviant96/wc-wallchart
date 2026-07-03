import {
  GUTTER_W,
  matchCenterSlot,
  WING_SLOTS,
} from "@/lib/bracket/bracketLayout";

type GutterDirection = "ltr" | "rtl";

interface BracketGutterProps {
  leftCount: number;
  rightCount: number;
  direction?: GutterDirection;
}

/** Classic ┐ bracket join between two rounds on one wing */
export function BracketGutter({
  leftCount,
  rightCount,
  direction = "ltr",
}: BracketGutterProps) {
  const w2 = GUTTER_W / 2;
  const paths: string[] = [];

  for (let k = 0; k < rightCount; k++) {
    const y1 = matchCenterSlot(2 * k, leftCount);
    const y2 = matchCenterSlot(2 * k + 1, leftCount);
    const yMid = matchCenterSlot(k, rightCount);
    paths.push(`M 0 ${y1} H ${w2} V ${yMid} H ${GUTTER_W}`);
    paths.push(`M 0 ${y2} H ${w2} V ${yMid}`);
  }

  return <GutterSvg paths={paths} direction={direction} />;
}

/** Semi-final → centre (final) on one wing */
export function BracketGutterToCenter({
  direction = "ltr",
}: {
  direction?: GutterDirection;
}) {
  const yMid = matchCenterSlot(0, 1);
  const d =
    direction === "ltr"
      ? `M 0 ${yMid} H ${GUTTER_W}`
      : `M ${GUTTER_W} ${yMid} H 0`;
  return <GutterSvg paths={[d]} direction={direction} />;
}

function GutterSvg({
  paths,
  direction = "ltr",
}: {
  paths: string[];
  direction?: GutterDirection;
}) {
  return (
    <div className="bracket-gutter-wrap flex shrink-0 flex-col">
      <div className="bracket-label-spacer mb-3 h-6 shrink-0" aria-hidden />
      <svg
        viewBox={`0 0 ${GUTTER_W} ${WING_SLOTS}`}
        preserveAspectRatio="none"
        width={GUTTER_W}
        className="bracket-gutter-svg block shrink-0 overflow-visible"
        aria-hidden
      >
        <g
          transform={
            direction === "rtl" ? `scale(-1,1) translate(${-GUTTER_W},0)` : undefined
          }
        >
          {paths.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke="#059669"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
