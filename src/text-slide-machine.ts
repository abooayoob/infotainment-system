import { createMachine, assign, sendParent } from "xstate";
import { TextSlide } from "./types";

export const createTextSlideMachine = ({
  textSlide,
}: {
  textSlide: TextSlide;
}) =>
  createMachine(
    {
      /** @xstate-layout N4IgpgJg5mDOIC5QBcwA9kFpYBsCWEYAdACJ6wAOOAhgJ4AEqGAxBAPYB2Y9ATmNRDwcoAbQAMAXUSgKbWHmR5O0kGkSYAjACYALEQCsAZn079YgGwB2LSbFidAGhC11GsZaIBOfeYAcGy0MdDSNArQBfcKcmLFwCYjJKGgYY5jRYZGpUImoAM1QeAAo3OwBKZhjsfEJScio6RnRkcSkkEFl5RWU2tQRMQy0NA31PbTF9DUNtTx1LJxcETyJDK30tS08tQ0sNXfN9SKiQDjZCeDbKuMIVDoUlDhVezB1gol93UwHNz08xQ3n1FtzAZfJZ9L53mItFpflpzJFok0qvFakkGjEbnI7t1QE9DJ5DG8PkYYTDfv9nK4dEs4TorKY-pYwd4ESBLtUEpwwJjOvdHogJkQ-BpfOZgu5Aht9gC+m4aWINOYxO9zPtDEEIocgA */
      id: "text-slide",
      predictableActionArguments: true,
      preserveActionOrder: true,
      tsTypes: {} as import("./text-slide-machine.typegen").Typegen0,

      schema: {
        context: {} as {
          textSlide: TextSlide;
        },
        events: {} as { type: "done reading" },
      },

      context: {
        textSlide,
      },

      states: {
        "Display text": {
          on: {
            "done reading": "Done",
          },

          entry: "app clear next activity",

          after: {
            "1000": {
              target: "Display text",
              internal: true,
              actions: ["update status", "update app"],
            },
          },
        },

        Done: {
          type: "final",
        },
      },

      initial: "Display text",
    },
    {
      actions: {
        "update status": assign((context, event) => {
          return {
            textSlide: {
              ...context.textSlide,
              status: "in progress" as const,
            },
          };
        }),
        "update app": sendParent((context, event) => {
          // todo: make this typesafe
          return {
            type: "update currentActivity",
            payload: context.textSlide,
          };
        }),
        "app clear next activity": sendParent((context, event) => {
          console.log("app clear next activity");
          return {
            type: "clear next activity",
          };
        }),
      },
    }
  );
