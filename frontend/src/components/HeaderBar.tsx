type HeaderBarProps = { onHome: () => void };

export default function HeaderBar({ onHome }: HeaderBarProps) {
  return (
    <header className="derme-header">
      <span className="derme-title">D.E.R.M.E v2.5</span>
      <button className="derme-home-btn" onClick={onHome}>
        Home
      </button>
    </header>
  );
}
