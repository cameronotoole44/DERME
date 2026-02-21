interface TerminalProps {
  lines: string[];
  showCursor?: boolean;
}

export default function Terminal({ lines, showCursor = true }: TerminalProps) {
  return (
    <div className="terminal" style={{ height: "100%" }}>
      <div className="terminal-content">
        {lines.map((line, idx) => (
          <div key={idx} className="terminal-line">
            <span className="prompt">&gt;</span>
            <span className="text">{line}</span>
          </div>
        ))}
        {showCursor && (
          <div className="terminal-line">
            <span className="prompt">&gt;</span>
            <span className="terminal-cursor" />
          </div>
        )}
      </div>
    </div>
  );
}
