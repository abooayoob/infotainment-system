import { createMachine, assign, sendParent } from "xstate";
import { TextSlide } from "./types";

export const createTextSlideMachine = ({
  textSlide,
}: {
  textSlide: TextSlide;
}) =>
  createMachine(
    {
      /** @xstate-layout N4IgpgJg5mDOIC5QBcwA9kFpYBsCWEYAdACJ6wAOOAhgJ4AEqGAxBAPYB2Y9ATmNRDwcoAbQAMAXUSgKbWHmR5O0kGkSYAjACYALEQCsAZn079YgGwB2LSbFidAGhC11GsZaIBOfeYAcGy0MdDSNArQBfSKcONkJ4JBAmLFwCMBVZeUVlBLUETB1gol93U0MtT3LPMUMnFzytQ3MDX0tzarMKnUsoxPRk-EJScio6Rj70uQUlDhVczENPQyKSo3LK6trXHU8iLXMdK1Nqy0t9bx6k7AHiEk40hIyp7NBc-Q0iPw1ffbcTw0tPOZ9Js8m4dloxBo2sVzEDDEEIpFwkA */
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
          return {
            type: "clear next activity",
          };
        }),
      },
    }
  );
