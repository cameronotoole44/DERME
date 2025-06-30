type InfoProps = {
  version?: string;
  build?: string;
  apiUrl?: string;
  targetMode?: "Simulated" | "Live";
};

export default function InfoPanel({
  version,
  build,
  apiUrl,
  targetMode,
}: InfoProps) {
  return (
    <div className="panel-body">
      <h3>Info</h3>

      {version && <p>Version&nbsp;&nbsp;: {version}</p>}
      {targetMode && <p>Mode: {targetMode}</p>}
      {build && <p>Build&nbsp;&nbsp;&nbsp;&nbsp;: {build}</p>}
      {apiUrl && <p>Loc&nbsp;&nbsp;&nbsp;&nbsp;: {apiUrl}</p>}
    </div>
  );
}
