type MonitorProps = {
  packetsPerSec?: number;
  latencyMs?: number;
  cpu?: number;
  elapsed?: string;
};

export default function MonitorPanel({
  packetsPerSec,
  latencyMs,
  cpu,
  elapsed,
}: MonitorProps) {
  const nothing =
    cpu === undefined &&
    packetsPerSec === undefined &&
    latencyMs === undefined &&
    elapsed === undefined;

  return (
    <div className="panel-body">
      <h3>System Monitor</h3>

      {nothing && <p>—</p>}

      {cpu !== undefined && <p>CPU&nbsp;&nbsp;&nbsp;: {cpu}%</p>}
      {packetsPerSec !== undefined && (
        <p>Packets/s: {packetsPerSec.toFixed(1)}</p>
      )}
      {latencyMs !== undefined && <p>Latency : {latencyMs} ms</p>}
      {elapsed && <p>Elapsed : {elapsed}</p>}
    </div>
  );
}
