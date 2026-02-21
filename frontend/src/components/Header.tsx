interface HeaderProps {
  onHome: () => void;
  currentExploit?: string;
}

export default function Header({ onHome, currentExploit }: HeaderProps) {
  return (
    <header className="header">
      <span className="header-title">VEXR</span>
      <div className="header-status">
        {currentExploit && <span>Active: {currentExploit.toUpperCase()}</span>}
        <button className="small" onClick={onHome}>
          Home
        </button>
      </div>
    </header>
  );
}
