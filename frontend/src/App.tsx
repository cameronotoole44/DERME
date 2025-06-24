import { useState, useEffect } from "react";
import "./css/App.css";
import TerminalWindow from "./components/Terminal";
import TiledResult from "./components/Tiled";

type ExploitType = "menu" | "xss" | "sqli" | "csrf" | "lfi";

const App = () => {
  const [view, setView] = useState<ExploitType>("menu");
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [mitigated, setMitigated] = useState(false);
  const [matrixLines, setMatrixLines] = useState<string[]>([]);
  const [booting, setBooting] = useState(true);
  const [bootOutput, setBootOutput] = useState<string[]>([]);

  useEffect(() => {
    const lines = [
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

      "",
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
      "Welcome User",
    ];

    let idx = 0;
    const interval = setInterval(() => {
      setBootOutput((prev) => [...prev, lines[idx]]);
      idx++;
      if (idx >= lines.length) {
        clearInterval(interval);
        setTimeout(() => setBooting(false), 1000);
      }
    }, 600);

    return () => clearInterval(interval);
  }, []);

  const fetchExploit = async (endpoint: string, label: ExploitType) => {
    setLoading(true);
    setMatrixLines([]);
    setTerminalOutput([]);
    setView(label);

    const interval = setInterval(() => {
      setMatrixLines((prev) => [...prev.slice(-15), generateMatrixLine()]);
    }, 60);

    setTimeout(async () => {
      clearInterval(interval);
      setMatrixLines([]);

      try {
        const resp = await fetch(`http://localhost:5000/${endpoint}`);
        const data = await resp.json();
        const output = (data.response || data.error || "Unknown Error").split(
          "\n"
        );
        setTerminalOutput(output);
      } catch {
        setTerminalOutput(["[ERROR] Exploit failed."]);
      }

      setLoading(false);
    }, 3000);
  };

  const generateMatrixLine = () => {
    const chars = "01|\\/#@-=:*%";
    const length = Math.floor(Math.random() * 60) + 20;
    return Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join("");
  };

  const reset = async () => {
    await fetch("http://localhost:5000/reset", { method: "POST" });
    setMitigated(false);
    setView("menu");
    setTerminalOutput([]);
  };

  const applyMitigation = async () => {
    await fetch("http://localhost:5000/mitigate", { method: "POST" });
    setMitigated(true);
  };

  return (
    <div className="app-container">
      <h1>D.E.R.M.E</h1>

      {booting ? (
        <TerminalWindow
          title="System Boot"
          lines={bootOutput}
          onExit={() => {}}
        />
      ) : view === "menu" ? (
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
      ) : loading ? (
        <TerminalWindow
          title="Executing Exploit..."
          lines={matrixLines}
          onExit={() => setView("menu")}
        />
      ) : (
        <TiledResult
          exploitType={view}
          resultLines={terminalOutput}
          onExit={() => setView("menu")}
        />
      )}
    </div>
  );
};

export default App;
