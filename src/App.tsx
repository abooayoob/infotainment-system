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
import { TextSlide } from "./TextSlide";

export function App() {
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
        <div style={{ textAlign: "left" }}>
          <pre>{JSON.stringify(state.value, null, 2)}</pre>
          <pre>{JSON.stringify(state.context, null, 2).trim()}</pre>
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
