import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useLocation, Link, Outlet, useNavigate } from "react-router-dom";
import React, { useCallback } from "react";
import { useMachine } from "@xstate/react";
import { createAppMachine } from "./app-machine";

function App() {
  const [count, setCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const appMachineCreator = useCallback(createAppMachine, []);
  const appMachine = appMachineCreator({ navigate });

  const [state, send] = useMachine(appMachine);

  React.useEffect(() => {
    console.log("location", location);
    send({ type: "url changed" });
  }, [location]);

  return (
    <>
      <div>
        <div style={{ textAlign: "left" }}>
          <pre>{JSON.stringify(state.value, null, 2)}</pre>
          <pre>{JSON.stringify(state.context, null, 2).trim()}</pre>
        </div>
        <Link to="/next-page/34">Next Page</Link>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      {/* <Outlet /> */}
    </>
  );
}

export default App;
