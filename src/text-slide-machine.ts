import { createMachine, assign, sendParent } from "xstate";
import { TextSlide } from "./types";

export const createTextSlideMachine = ({
  textSlide,
}: {
  textSlide: TextSlide;
}) =>
  createMachine(
    {
      /** @xstate-layout N4IgpgJg5mDOIC5QBcwA9kFpYBsCWEYAdACJ6wAOOAhgJ4AEqGAxBAPYB2Y9ATmNRDwcoAbQAMAXUSgKbWHmR5O0kGkSYAjACYALEQCsAZn079YgGwB2LSbFidAGhC11GsZaIBOfeYAcGy0MdDSNArQBfcKcmLFwCYjJKGgYY5jRYZGpUImoAM1QeAAo3OwBKZhjsfEJScio6RnRkcSkkEFl5RWU2tQRMQ3N9InNzHR1Pcw1g+x1LJxc+42G3Ty0tMR8RsUNffUiokA42Qng2yrjCFQ6FJQ4VXsxgw2HR8cnpsbnnVwmDXX0tL4Bp5LJZfKNItEmlV4rUkg0Ylc5DduqAHlorF5fLsJiN1lYQvNXGJPER1hpzGJfBZBoYghEDudqglOGAkZ1bvdEPoNMN-ODpqDDJYJvoiX0VmSxBSqTSjPT9uEgA */
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
      },
    }
  );
