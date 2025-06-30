import { useEffect, useMemo, useState } from "react";
import Draggable from "react-draggable";
import "../css/Tiled.css";
import TerminalWindow from "./Terminal";
import SummaryPanel from "./panels/SummaryPanel";
import StatusPanel from "./panels/StatusPanel";
import InfoPanel from "./panels/InfoPanel";

type Props = { exploit: string; lines: string[] };
type PanelKey = "terminal" | "summary" | "status" | "info";

export default function TiledResult({ exploit, lines }: Props) {
  const [center, setCenter] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const sync = () => setCenter({ x: innerWidth / 2, y: innerHeight / 2 });
    sync();
    addEventListener("resize", sync);
    return () => removeEventListener("resize", sync);
  }, []);

  const [order, setOrder] = useState<PanelKey[]>([
    "terminal",
    "summary",
    "status",
    "info",
  ]);
  const bringToFront = (key: PanelKey) =>
    setOrder((prev) => [...prev.filter((k) => k !== key), key]);

  const radius = 220;
  const panel = useMemo(
    () => ({
      terminal: {
        comp: (
          <TerminalWindow
            title="Exploit Output"
            lines={lines}
            onExit={() => {}}
          />
        ),
        w: 600,
        h: 300,
        ang: 0,
      },
      summary: {
        comp: <SummaryPanel exploit={exploit} resultLines={lines} />,
        w: 300,
        h: 180,
        ang: Math.PI / 2,
      },
      status: {
        comp: <StatusPanel exploit={exploit} />,
        w: 300,
        h: 150,
        ang: Math.PI,
      },
      info: {
        comp: <InfoPanel />,
        w: 300,
        h: 200,
        ang: (3 * Math.PI) / 2,
      },
    }),
    [exploit, lines]
  );

  return (
    <div className="tiled-container">
      {order.map((key, idx) => {
        const p = panel[key];
        const x = center.x + radius * Math.cos(p.ang) - p.w / 2;
        const y = center.y + radius * Math.sin(p.ang) - p.h / 2;

        return (
          <div
            key={key}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: p.w,
              height: p.h,
              zIndex: idx + 1,
            }}
            onMouseDown={() => bringToFront(key)}
          >
            <Draggable bounds="parent">
              <div
                className="floating-panel"
                style={{ width: "100%", height: "100%" }}
              >
                {p.comp}
              </div>
            </Draggable>
          </div>
        );
      })}
    </div>
  );
}
