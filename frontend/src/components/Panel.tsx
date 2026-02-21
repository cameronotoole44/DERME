import { useState, useRef } from "react";
import { Rnd } from "react-rnd";

let globalZ = 1;

interface PanelProps {
  title: string;
  children: React.ReactNode;
  x: number;
  y: number;
  width?: number;
  height?: number;
  onClose?: () => void;
}

export default function Panel({
  title,
  children,
  x,
  y,
  width = 320,
  height = 200,
  onClose,
}: PanelProps) {
  const [zIndex, setZIndex] = useState(() => ++globalZ);
  const nodeRef = useRef<HTMLDivElement>(null);

  const raise = () => setZIndex(++globalZ);

  return (
    <Rnd
      default={{ x, y, width, height }}
      minWidth={200}
      minHeight={120}
      dragHandleClassName="panel-header"
      onDragStart={raise}
      onResizeStart={raise}
      style={{ zIndex }}
    >
      <div
        ref={nodeRef}
        className="panel"
        style={{ width: "100%", height: "100%" }}
        onMouseDown={raise}
      >
        <div className="panel-header">
          <span>{title}</span>
          {onClose && (
            <button className="small secondary" onClick={onClose}>
              X
            </button>
          )}
        </div>
        <div className="panel-body">{children}</div>
      </div>
    </Rnd>
  );
}
