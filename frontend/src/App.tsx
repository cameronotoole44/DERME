import { useState, useEffect } from "react";
import "./css/styles.css";
import { api, Exploit, ExploitResult, MitigationStatus } from "./api";
import Header from "./components/Header";
import Panel from "./components/Panel";
import Terminal from "./components/Terminal";

type View = "menu" | "loading" | "result";

const DEFAULT_EXPLOITS: Exploit[] = [
  {
    id: "xss_reflected",
    name: "Reflected XSS",
    category: "xss",
    description: "Injects script tags into reflected user input",
    payloads: [],
  },
  {
    id: "sqli_login",
    name: "SQL Injection",
    category: "sqli",
    description: "Bypasses authentication using SQL injection",
    payloads: [],
  },
  {
    id: "csrf_transfer",
    name: "CSRF Transfer",
    category: "csrf",
    description: "Performs unauthorized fund transfer",
    payloads: [],
  },
  {
    id: "lfi_path_traversal",
    name: "LFI",
    category: "lfi",
    description: "Reads arbitrary files via path traversal",
    payloads: [],
  },
];

export default function App() {
  const [view, setView] = useState<View>("menu");
  const [exploits, setExploits] = useState<Exploit[]>(DEFAULT_EXPLOITS);
  const [currentExploit, setCurrentExploit] = useState<string | null>(null);
  const [result, setResult] = useState<ExploitResult | null>(null);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [mitigation, setMitigation] = useState<MitigationStatus>({
    xss: false,
    sqli: false,
    csrf: false,
    lfi: false,
  });
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState("00:00:00");

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (startTime === null) return;
    const id = setInterval(() => {
      const sec = Math.floor((Date.now() - startTime) / 1000);
      setElapsed(new Date(sec * 1000).toISOString().substring(11, 19));
    }, 1000);
    return () => clearInterval(id);
  }, [startTime]);

  async function loadInitialData() {
    try {
      const [exploitList, status] = await Promise.all([
        api.getExploits(),
        api.getStatus(),
      ]);
      setExploits(exploitList);
      setMitigation(status);
    } catch {
      // Backend not available, use defaults
    }
  }

  async function runExploit(exploitId: string) {
    setCurrentExploit(exploitId);
    setView("loading");
    setTerminalLines([]);
    setStartTime(Date.now());

    try {
      const res = await api.runExploit(exploitId);
      setResult(res);

      const responseText =
        typeof res.response === "string"
          ? res.response
          : JSON.stringify(res.response, null, 2);

      const lines = [
        `[EXPLOIT] ${exploitId.toUpperCase()}`,
        `[PAYLOAD] ${res.payload_used ?? "N/A"}`,
        "",
        `[SUCCESS] ${res.success ? "YES" : "NO"}`,
        res.error ? `[ERROR] ${res.error}` : "",
        "",
        "[RESPONSE]",
        ...responseText.split("\n"),
      ].filter(Boolean);
      setTerminalLines(lines);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setTerminalLines([`[ERROR] ${msg}`]);
      setResult(null);
    }

    setView("result");
  }

  async function applyMitigation(type: string) {
    if (mitigation[type]) return; // already mitigated
    try {
      const status = await api.mitigate(type);
      setMitigation(status);
    } catch {
      setMitigation((prev) => ({ ...prev, [type]: true }));
    }
  }

  async function resetAll() {
    try {
      const status = await api.reset();
      setMitigation(status);
    } catch {
      setMitigation({ xss: false, sqli: false, csrf: false, lfi: false });
    }
  }

  function goHome() {
    setView("menu");
    setCurrentExploit(null);
    setResult(null);
    setTerminalLines([]);
    setStartTime(null);
    setElapsed("00:00:00");
  }

  if (view === "loading") {
    return (
      <div className="loading">
        <div className="loading-text">
          Executing {currentExploit?.toUpperCase()}...
        </div>
        <div className="loading-bar">
          <div className="loading-bar-fill" />
        </div>
      </div>
    );
  }

  if (view === "menu") {
    return (
      <div className="menu">
        <h1>D.E.R.M.E</h1>

        <div className="exploit-grid">
          {exploits.map((exp) => (
            <div
              key={exp.id}
              className="exploit-card"
              onClick={() => runExploit(exp.id)}
            >
              <div className="name">{exp.name}</div>
              <div className="category">{exp.category}</div>
            </div>
          ))}
        </div>

        <div className="menu-controls">
          <button className="secondary" onClick={resetAll}>
            Reset All
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header onHome={goHome} currentExploit={currentExploit ?? undefined} />

      <div className="workspace">
        <Panel title="Terminal" x={60} y={20} width={500} height={300}>
          <Terminal lines={terminalLines} />
        </Panel>

        <Panel title="Result" x={580} y={20} width={280} height={160}>
          <div className="status-row">
            <span className="status-label">Exploit</span>
            <span className="status-value">
              {currentExploit?.toUpperCase()}
            </span>
          </div>
          <div className="status-row">
            <span className="status-label">Status</span>
            <span
              className={`status-value ${result?.success ? "success" : "error"}`}
            >
              {result?.success ? "Success" : "Failed"}
            </span>
          </div>
          <div className="status-row">
            <span className="status-label">Elapsed</span>
            <span className="status-value">{elapsed}</span>
          </div>
        </Panel>

        <Panel title="Mitigations" x={580} y={220} width={280} height={220}>
          <div className="mitigation-list">
            {Object.entries(mitigation).map(([type, active]) => (
              <div key={type} className="mitigation-item">
                <span className="label">{type}</span>
                <button
                  className={`small ${active ? "secondary" : ""}`}
                  onClick={() => applyMitigation(type)}
                  disabled={active}
                >
                  {active ? "Active" : "Apply"}
                </button>
              </div>
            ))}
          </div>
          <button
            className="secondary"
            style={{ marginTop: "12px", width: "100%" }}
            onClick={resetAll}
          >
            Reset All
          </button>
        </Panel>

        <Panel title="Info" x={60} y={340} width={280} height={120}>
          <div className="status-row">
            <span className="status-label">Version</span>
            <span className="status-value">2.5</span>
          </div>
          <div className="status-row">
            <span className="status-label">Mode</span>
            <span className="status-value">Simulated</span>
          </div>
          <div className="status-row">
            <span className="status-label">Target</span>
            <span className="status-value">localhost:5001</span>
          </div>
        </Panel>
      </div>
    </>
  );
}
