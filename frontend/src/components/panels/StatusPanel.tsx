type StatusProps = {
  exploit?: string;
  phase?: "Recon" | "Inject" | "Validate" | "Mitigate";
  result?: "Pending" | "Success" | "Error";
  mitigated?: boolean;
};

export default function StatusPanel({
  exploit,
  phase,
  result,
  mitigated,
}: StatusProps) {
  return (
    <div className="panel-body">
      {exploit && <p>Exploit&nbsp;&nbsp;: {exploit.toUpperCase()}</p>}
      {phase && <p>Phase&nbsp;&nbsp;&nbsp;&nbsp;: {phase}</p>}
      {result && <p>Result&nbsp;&nbsp;&nbsp;: {result}</p>}
      {mitigated !== undefined && (
        <p>Mitigation: {mitigated ? "Mitigated" : "Pending"}</p>
      )}
    </div>
  );
}
