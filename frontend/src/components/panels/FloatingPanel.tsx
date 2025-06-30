import Draggable from "react-draggable";
import "../../css/Floating.css";

type Props = {
  title: string;
  children: React.ReactNode;
  resizable?: boolean;
  initialPosition?: { x: number; y: number };
};

const FloatingPanel = ({
  title,
  children,
  resizable = false,
  initialPosition = { x: 60, y: 60 },
}: Props) => {
  return (
    <Draggable handle=".panel-header" defaultPosition={initialPosition}>
      <div
        className={`floating-panel ${resizable ? "resizable" : ""}`}
        style={{ position: "absolute" }}
      >
        <div className="panel-header">{title}</div>
        <div className="panel-body">{children}</div>
      </div>
    </Draggable>
  );
};

export default FloatingPanel;
