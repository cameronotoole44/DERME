import { useState, useRef } from "react";
import { Rnd } from "react-rnd";
import "../../css/Floating.css";

let globalTopZ = 1;

interface DraggablePanelProps {
  children: React.ReactNode;
  title?: string;
  defaultX: number;
  defaultY: number;
  defaultWidth?: number;
  defaultHeight?: number;
}

export default function DraggablePanel({
  children,
  title = "Panel",
  defaultX,
  defaultY,
  defaultWidth = 320,
  defaultHeight = 200,
}: DraggablePanelProps) {
  const [zIndex, setZIndex] = useState(++globalTopZ);

  const raise = () => setZIndex(() => ++globalTopZ);

  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <Rnd
      nodeRef={nodeRef}
      default={{
        x: defaultX,
        y: defaultY,
        width: defaultWidth,
        height: defaultHeight,
      }}
      dragHandleClassName="panel-header"
      onDragStart={raise}
      onResizeStart={raise}
      className="floating-panel"
      style={{ zIndex }}
    >
      <div
        ref={nodeRef}
        onMouseDown={raise}
        style={{ width: "100%", height: "100%" }}
      >
        <div className="panel-header">{title}</div>
        <div className="panel-body">{children}</div>
      </div>
    </Rnd>
  );
}
