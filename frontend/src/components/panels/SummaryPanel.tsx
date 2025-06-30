type Props = {
  exploit?: string;
  resultLines: string[];
};

const SummaryPanel = ({ exploit = "N/A", resultLines }: Props) => {
  return (
    <div>
      <p>Type: {exploit?.toUpperCase?.() || "UNKNOWN"}</p>
      <p>Status: {resultLines[0]?.includes("ERROR") ? "Failed" : "Success"}</p>
      <p>Time: {new Date().toLocaleTimeString()}</p>
      <hr />
      <pre>{resultLines.slice(0, 5).join("\n")}</pre>
    </div>
  );
};

export default SummaryPanel;
