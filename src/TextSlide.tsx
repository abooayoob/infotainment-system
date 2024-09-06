import { useActor } from "@xstate/react";
import { ActorRefFrom } from "xstate";
import { createTextSlideMachine } from "./text-slide-machine";

export function TextSlide({
  textSlideMachine,
}: {
  textSlideMachine: ActorRefFrom<typeof createTextSlideMachine>;
}) {
  const [slideState, slideSend] = useActor(textSlideMachine);
  if (!textSlideMachine) return null;

  return (
    <div>
      <h1>{slideState.context.textSlide.title}</h1>
      <p>{slideState.context.textSlide.content}</p>
      <button onClick={() => slideSend({ type: "done reading" })}>
        Done Reading
      </button>
    </div>
  );
}
