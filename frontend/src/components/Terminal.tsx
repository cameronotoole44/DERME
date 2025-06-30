import "../css/Terminal.css";

type TerminalWindowProps = {
  title: string;
  lines: string[];
  onExit: () => void;
};

const TerminalWindow = ({ title, lines, onExit }: TerminalWindowProps) => {
  return (
    <div className="terminal-window">
      <div className="terminal-header">
        <span>{title}</span>
        <button onClick={onExit}>Exit</button>
      </div>
      <div className="terminal-body">
        {lines.map((line, idx) => (
          <div key={idx} className="terminal-line">
            <span>&gt;</span> {line}
          </div>
        ))}
        <div className="cursor" />
      </div>
    </div>
  );
};

export default TerminalWindow;
