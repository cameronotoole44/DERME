import { useState, useEffect } from "react";
import "./css/App.css";
import HeaderBar from "./components/HeaderBar";
import TerminalWindow from "./components/Terminal";
import SummaryPanel from "./components/panels/SummaryPanel";
import StatusPanel from "./components/panels/StatusPanel";
import MonitorPanel from "./components/panels/MonitorPanel";
import InfoPanel from "./components/panels/InfoPanel";
import DraggablePanel from "./components/panels/DraggablePanel";

type ExploitType = "menu" | "xss" | "sqli" | "csrf" | "lfi";

const App = () => {
  const [view, setView] = useState<ExploitType>("menu");
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [mitigated, setMitigated] = useState(false);
  const [matrixLines, setMatrixLines] = useState<string[]>([]);
  const [booting, setBooting] = useState(true);
  const [bootOutput, setBootOutput] = useState<string[]>([]);

  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState<string>();
  const [cpu, setCpu] = useState<number>();
  const [pps, setPps] = useState<number>();
  const [latency, setLatency] = useState<number>();

  useEffect(() => {
    const lines = [
      "><<<<<    ><<<<<<<<><<<<<<<    ><<       ><<><<<<<<<<",
      "><<   ><< ><<      ><<    ><<  >< ><<   ><<<><<",
      "><<    ><<><<      ><<    ><<  ><< ><< > ><<><< ",
      "><<    ><<><<<<<<  >< ><<      ><<  ><<  ><<><<<<<<  ",
      "><<    ><<><<      ><<  ><<    ><<   ><  ><<><< ",
      "><<   ><< ><<      ><<    ><<  ><<       ><<><< ",
      "><<<<<    ><<<<<<<<><<      ><<><<       ><<><<<<<<<<",
      "",
      "[BOOT] Initializing Core Systems...",
      "[ OK ] Loading Exploit Modules",
      "[ OK ] Network Layer Linked",
      "[ OK ] Payload Injection Ready",
      "⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠛⠻⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿",
      "⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⣉⣤⣶⣿⣿⣿⣿⣶⣦⣉⣙⠿⢿⣿⣿⣿⠿⠟⣋⣉⣡⣤⣤⣉⣛⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿",
      "⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢋⣤⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣦⣍⠡⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣷⡌⢻⣿⣿⣿⣿⣿⣿⣿⣿",
      "⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⣡⣾⣿⣿⣿⣿⣿⠿⠟⢛⣛⣛⣛⠛⠻⢿⣿⣿⣆⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡌⣿⣿⣿⣿⣿⣿⣿⣿",
      "⣿⣿⣿⣿⣿⣿⣿⣿⠋⣼⣿⣿⣿⣿⡟⣉⣤⣶⣾⣿⣿⣿⣿⣿⣷⣦⣬⣙⡛⠀⣛⣩⣭⣭⣭⣭⣭⣥⣭⣬⣍⣁⡘⢿⣿⣿⣿⣿⣿⣿",
      "⣿⣿⣿⣿⣿⣿⣿⠏⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⠛⢛⣛⣛⣛⣛⠒⠌⠛⢿⣿⣿⣿⡿⠿⠿⠟⠛⠛⠛⠓⠦⠌⠙⠻⣿⣿",
      "⣿⣿⣿⣿⡿⠿⠀⠈⠙⠛⠻⠿⢿⣿⠿⠿⠛⠛⠛⠉⠐⠒⠚⠉⠉⠐⠒⠂⠉⠉⠓⠒⠦⠋⡩⠔⠒⠀⠀⠉⠉⠉⠉⠉⠁⠀⠀⠀⠈⠛",
      "⣿⣿⣿⠛⣤⡆⢸⣷⣶⣦⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⢀⠀⠀⠀⠀",
      "⣿⡿⢡⣾⣿⣇⣸⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢜⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⠀",
      "⡿⢁⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢾⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
      "⢡⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣆⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⠀⠀⠀⠀⢀⣤⣶⣶⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
      "⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣾⣿⣿⠿⣿⣦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀",
      "⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣶⣶⠶⠖⢒⣀⣤⣶⣾⣿⣿⣿⣿⣿⣦⣤⡀⢭⣤⣤⣤⣴⣄⢒⢶⣾⣿⣿⣿",
      "⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⠿⣿⣿⣿⣿⣿⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣾⣿⣿⣿⣿⣿⣿⣆⠙⣿⣿⣿",
      "⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⢁⣤⣶⣶⣶⣌⠙⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⢻⣿⣿",
      "⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⣿⣿⡿⠿⣿⣿⣿⣶⣦⣌⣙⠛⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠸⢿⣿",
      "⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡈⢻⣿⣷⣶⣤⣝⡛⠛⠿⣿⣿⣷⣶⣶⣮⣭⣭⣭⣝⣛⡛⠛⠛⠛⠛⠻⠟⠛⠛⢛⣫⣥⣴⣾⡿⢸⣿",
      "⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣤⡙⠻⢿⣿⣿⣿⣷⣶⣦⣬⣭⣙⡙⠛⠛⠻⠿⠿⠿⠿⠿⠿⣿⣿⣷⣾⣿⡿⠿⠿⠟⠛⣩⣶⣿⣿",
      "⣤⠄⠉⠙⠛⠻⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣤⣍⡛⠛⠿⠿⣿⣿⣿⣿⣿⣿⣾⣿⣷⣿⣶⣿⣶⣶⣶⣶⣶⠶⠶⠛⠚⠈⣁⣬⡍⠥⢠",
      "⣷⠡⠈⠋⠳⠂⠔⠀⣈⠛⠻⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣦⣤⣤⣤⣤⣤⣈⣉⣉⣉⣉⡉⡙⠛⠛⠋⡀⠐⢶⣶⠾⠡⣨⡽⣆⢢⣺",
      "⣿⠄⠀⠈⡕⠀⠴⣿⣿⡿⢷⠂⢤⠀⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⢠⠤⠲⠀⡈⢹⠷⠄⠑⣿⠄⠘⡀⠈⠉⣁",
      "⣀⠀⠀⣁⣀⠀⢀⠊⠀⢰⠀⣆⠀⠡⡈⠻⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⠋⣠⢁⠀⠆⠀⠀⡈⢂⠰⣤⣬⣭⣤⣤⣤⣤⣤",
      "⢃⡒⣚⠋⣓⠀⣀⡐⢀⡚⢀⡘⢀⡀⢀⡐⣒⡒⢀⡀⢀⡀⢀⡉⢉⡉⢁⡁⢀⡀⢒⡀⠀⣃⠘⣲⠒⣒⠚⣓⠈⡄⠹⠿⠙⠿⠋⠿⠿⣿",
      "⡎⢀⣉⣀⣉⣁⣉⣁⣉⣁⣈⣁⣉⣁⣈⣁⣉⣁⣈⣁⣈⣁⣈⣁⣈⣁⣠⣤⣄⣡⣤⣤⣤⣤⣤⣤⣤⣴⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⡆⢿",
      "⡇⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⢸",
      "Welcome User",
    ];

    let idx = 0;
    const id = setInterval(() => {
      setBootOutput((p) => [...p.slice(-15), lines[idx++]]);
      if (idx >= lines.length) {
        clearInterval(id);
        setTimeout(() => setBooting(false), 1000);
      }
    }, 300);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (startTime === null) return;
    const id = setInterval(() => {
      const sec = Math.floor((Date.now() - startTime) / 1000);
      setElapsed(new Date(sec * 1000).toISOString().substring(11, 19));
    }, 1000);
    return () => clearInterval(id);
  }, [startTime]);

  const generateMatrixLine = () => {
    const chars = "01|\\/#@-=:*%";
    const len = Math.floor(Math.random() * 60) + 20;
    return Array.from(
      { length: len },
      () => chars[(Math.random() * chars.length) | 0]
    ).join("");
  };

  const goHome = () => {
    setView("menu");
    setStartTime(null);
    setElapsed(undefined);
    setTerminalOutput([]);
    setMatrixLines([]);
  };

  const fetchExploit = async (endpoint: string, label: ExploitType) => {
    setLoading(true);
    setMatrixLines([]);
    setTerminalOutput([]);
    setView(label);

    setStartTime(Date.now());
    setCpu(undefined);
    setPps(undefined);
    setLatency(undefined);

    const animId = setInterval(
      () =>
        setMatrixLines((prev) => [...prev.slice(-15), generateMatrixLine()]),
      60
    );

    setTimeout(async () => {
      clearInterval(animId);
      setMatrixLines([]);

      try {
        const resp = await fetch(`http://localhost:5000/${endpoint}`);
        const raw = await resp.text();
        let payload: string | undefined;

        try {
          const data = JSON.parse(raw);
          payload =
            data.response ??
            data.result ??
            data.message ??
            data.error ??
            (typeof data === "string" ? data : undefined);
          if (!payload || !payload.trim()) payload = raw.trim();
        } catch {
          payload = raw.trim();
        }

        const output =
          payload && payload.length
            ? payload.split("\n")
            : ["[ERROR] Exploit failed."];

        setTerminalOutput(output);
      } catch {
        setTerminalOutput(["[ERROR] Exploit failed."]);
      }

      setLoading(false);
    }, 3000);
  };

  const reset = async () => {
    await fetch("http://localhost:5000/reset", { method: "POST" });
    setMitigated(false);
    goHome();
  };

  const applyMitigation = async () => {
    await fetch("http://localhost:5000/mitigate", { method: "POST" });
    setMitigated(true);
  };

  return (
    <>
      {booting ? (
        <div className="boot-center">
          <TerminalWindow
            title="System Boot"
            lines={bootOutput}
            onExit={() => {}}
          />
        </div>
      ) : view === "menu" ? (
        <div className="menu-center">
          <h1>D.E.R.M.E</h1>
          <div className="button-group">
            <button onClick={() => fetchExploit("exploit", "xss")}>
              Run XSS
            </button>
            <button onClick={() => fetchExploit("exploit_sqli", "sqli")}>
              Run SQLi
            </button>
            <button onClick={() => fetchExploit("exploit_csrf", "csrf")}>
              Run CSRF
            </button>
            <button onClick={() => fetchExploit("exploit_lfi", "lfi")}>
              Run LFI
            </button>
            <button onClick={applyMitigation} disabled={mitigated}>
              Mitigate
            </button>
            <button onClick={reset}>Reset</button>
          </div>
        </div>
      ) : loading ? (
        <div className="boot-center">
          <TerminalWindow
            title="Executing Exploit..."
            lines={matrixLines}
            onExit={goHome}
          />
        </div>
      ) : (
        <>
          <HeaderBar onHome={goHome} />

          <div className="app-container">
            <DraggablePanel title="Terminal" defaultX={100} defaultY={80}>
              <TerminalWindow
                title={`Result: ${view.toUpperCase()}`}
                lines={terminalOutput}
                onExit={goHome}
              />
            </DraggablePanel>

            <DraggablePanel title="Summary" defaultX={460} defaultY={80}>
              <SummaryPanel exploit={view} resultLines={terminalOutput} />
            </DraggablePanel>

            <DraggablePanel title="Status" defaultX={820} defaultY={80}>
              <StatusPanel exploit={view} mitigated={mitigated} />
            </DraggablePanel>

            <DraggablePanel title="Monitor" defaultX={100} defaultY={320}>
              <MonitorPanel
                cpu={cpu}
                packetsPerSec={pps}
                latencyMs={latency}
                elapsed={elapsed}
              />
            </DraggablePanel>

            <DraggablePanel title="Info" defaultX={460} defaultY={320}>
              <InfoPanel version="2.5" build="#042" targetMode="Simulated" />
            </DraggablePanel>
          </div>
        </>
      )}
    </>
  );
};

export default App;
