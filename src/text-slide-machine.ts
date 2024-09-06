import { createMachine, assign, sendParent } from "xstate";
import { TextSlide } from "./types";

export const createTextSlideMachine = ({
  textSlide,
}: {
  textSlide: TextSlide;
}) =>
  createMachine(
    {
      /** @xstate-layout N4IgpgJg5mDOIC5QBcwA9kFpYBsCWEYAdACJ6wAOOAhgJ4AEqGAxBAPYB2Y9ATmNRDwcoAbQAMAXUSgKbWHmR5O0kGkSYAjGIAsRABwB2PQFYAbGI0bjegMwGATKYA0IWuo02xRG9oPabAJwGAfYaQWKmAL6RLkxYuATEZJQ0DHHMaLDI1KhE1ABmqDwAFFpiYgCUzHHY+ISk5FR0jOjI4lJIILLyisqdagiYNqFExsYBGvZixh6TAb4ubggB3qYGxvbB9naWGqbG0TEgHGyE8J01CYQq3QpKHCoDmNraGvpifsbDIQEBYjaLdTbUyjQzWPTlez2P42aKxVq1RINFLNOI3OR3PqgJ6BGzvT7faEwwGDDTaFaObRrbTGf4GdYBA5HS51JKcMDonr3R6IdZEbbzMJ6EymF4LVzuMQUizmCGmfY2Hz2Q6RIA */
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
            "done reading": {
              target: "Done",
              actions: ["update status", "update app"],
            },
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
              status:
                event.type === "done reading"
                  ? ("done" as const)
                  : ("in progress" as const),
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
