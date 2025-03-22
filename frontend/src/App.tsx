import { useState } from "react";
import "./App.css";

const App = () => {
  const [xssResult, setXssResult] = useState<string>("");
  const [sqliResult, setSqliResult] = useState<string>("");
  const [csrfResult, setCsrfResult] = useState<string>("");
  const [lfiResult, setLfiResult] = useState<string>("");
  const [mitigated, setMitigated] = useState(false);

  const runXssExploit = async () => {
    try {
      const resp = await fetch("http://localhost:5000/exploit");
      const data = await resp.json();
      setXssResult(data.response || "Error: No response");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setXssResult(`XSS Exploit Failed: ${message}`);
    }
  };

  const runSqliExploit = async () => {
    try {
      const resp = await fetch("http://localhost:5000/exploit_sqli");
      if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
      const data = await resp.json();
      setSqliResult(JSON.stringify(data.response || data.error, null, 2));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setSqliResult(`SQLi Exploit Failed: ${message}`);
    }
  };

  const runCsrfExploit = async () => {
    try {
      const resp = await fetch("http://localhost:5000/exploit_csrf");
      if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
      const data = await resp.json();
      setCsrfResult(JSON.stringify(data.response || data.error, null, 2));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setCsrfResult(`CSRF Exploit Failed: ${message}`);
    }
  };

  const runLfiExploit = async () => {
    try {
      const resp = await fetch("http://localhost:5000/exploit_lfi");
      if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
      const data = await resp.json();
      setLfiResult(JSON.stringify(data.response || data.error, null, 2));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setLfiResult(`LFI Exploit Failed: ${message}`);
    }
  };

  const applyMitigation = async () => {
    try {
      await fetch("http://localhost:5000/mitigate", { method: "POST" });
      setMitigated(true); // SET ONLY HERE
    } catch (error: unknown) {
      console.error("Mitigation failed:", error);
    }
  };

  const reset = async () => {
    try {
      await fetch("http://localhost:5000/reset", { method: "POST" });
      setXssResult("");
      setSqliResult("");
      setCsrfResult("");
      setLfiResult("");
      setMitigated(false); // RESET HERE ONLY
    } catch (error: unknown) {
      console.error("Reset failed:", error);
    }
  };

  return (
    <div className="app-container">
      <h1>DERME 2.0</h1>
      <div className="button-group">
        <button onClick={runXssExploit}>Run XSS Exploit</button>
        <button onClick={runSqliExploit}>Run SQLi Exploit</button>
        <button onClick={runCsrfExploit}>Run CSRF Exploit</button>
        <button onClick={runLfiExploit}>Run LFI Exploit</button>
        <button onClick={applyMitigation} disabled={mitigated}>
          Apply Mitigation
        </button>
        <button onClick={reset}>Reset</button>
      </div>
      <h2>XSS Result:</h2>
      <pre dangerouslySetInnerHTML={{ __html: xssResult }} />
      <h2>SQLi Result:</h2>
      <pre>{sqliResult}</pre>
      <h2>CSRF Result:</h2>
      <pre>{csrfResult}</pre>
      <h2>LFI Result:</h2>
      <pre>{lfiResult}</pre>
    </div>
  );
};

export default App;
