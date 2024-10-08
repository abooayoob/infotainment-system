import { useMemo, useState } from "react";
import { useLocation, Link, Outlet, useNavigate } from "react-router-dom";
import React, { useCallback } from "react";
import { NextUIProvider } from "@nextui-org/react";
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

  const [state, send, actor] = useMachine(appMachine, { devTools: true });
  let textSlideActor = actor.children.get("textSlideMachine");

  React.useEffect(() => {
    // console.log("location", location);
    // send({ type: "url changed" });
  }, [location]);

  return (
    <NextUIProvider>
      <main className="grid h-full min-h-screen w-full min-w-full bg-background text-foreground dark">
        {/* <div style={{ textAlign: "left" }}>
          <pre>{JSON.stringify(state.value, null, 2)}</pre>
          <pre>{JSON.stringify(state.context, null, 2).trim()}</pre>
        </div> */}
        {state.matches("Activity.Text slide") && textSlideActor && (
          <TextSlide
            textSlideMachine={
              textSlideActor as ActorRefFrom<typeof createTextSlideMachine>
            }
          />
        )}
        {/* <Link to="/next-page/34">Next Page</Link> */}
      </main>

      {/* <Outlet /> */}
    </NextUIProvider>
  );
}
