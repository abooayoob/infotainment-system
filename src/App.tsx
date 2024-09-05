import { useMemo, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useLocation, Link, Outlet, useNavigate } from "react-router-dom";
import React, { useCallback } from "react";
import { useActor, useMachine } from "@xstate/react";
import type { Actor, ActorRefFrom } from "xstate";
import { createAppMachine } from "./app-machine";
import { createTextSlideMachine } from "./text-slide-machine";

function App() {
  const [count, setCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const appMachineCreator = useCallback(createAppMachine, []);
  const appMachine = useMemo(() => appMachineCreator({ navigate }), []);

  const [state, send, actor] = useMachine(appMachine);
  let textSlideActor = actor.children.get("textSlideMachine");

  React.useEffect(() => {
    // console.log("location", location);
    // send({ type: "url changed" });
  }, [location]);

  return (
    <>
      <div>
        <h3>{count}</h3>
        <button onClick={() => setCount(count + 1)}>Increment</button>
        <div style={{ textAlign: "left" }}>
          <pre>{JSON.stringify(state.value, null, 2)}</pre>
          <pre>
            {JSON.stringify(state.context.nextActivity, null, 2).trim()}
          </pre>
        </div>
        {state.matches("Activity.Text slide") && textSlideActor && (
          <TextSlide
            textSlideMachine={
              textSlideActor as ActorRefFrom<typeof createTextSlideMachine>
            }
          />
        )}
        {/* <Link to="/next-page/34">Next Page</Link> */}
      </div>

      {/* <Outlet /> */}
    </>
  );
}

function TextSlide({
  textSlideMachine,
}: {
  textSlideMachine: ActorRefFrom<typeof createTextSlideMachine>;
}) {
  const [slideState, slideSend] = useActor(textSlideMachine);
  if (!textSlideMachine) return null;

  // if (!appState.children["textSlideMachine"]) return null;

  // console.log("appState", JSON.stringify(appState.children));

  // const [slideState, slideSend] = useActor(
  //   appState.children["textSlideMachine"] as ActorRefFrom<
  //     typeof createTextSlideMachine
  //   >
  // );

  return (
    <div>
      <h1>{slideState.context.textSlide.title}</h1>
      <p>{slideState.context.textSlide.content}</p>
      <button onClick={() => slideSend({ type: "done reading" })}>
        Done Reading
      </button>
      Hello
    </div>
  );
}

export default App;
