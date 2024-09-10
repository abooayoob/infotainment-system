import { createMachine, assign, raise } from "xstate";
import type { AnyStateMachine } from "xstate";

import { NavigateFunction } from "react-router-dom";
import type { Activity } from "./types";
import { createTextSlideMachine } from "./text-slide-machine";

// not good enough, improve later
function findMostProgress({
  url,
  local,
}: {
  url: Activity;
  local: Activity;
}): Activity {
  if (url.status === "not started" && local.status === "not started")
    return url;

  const urlIndex = url.children.findIndex((c) => c.status !== "not started");
  const localIndex = local.children.findIndex(
    (c) => c.status !== "not started",
  );

  return localIndex > urlIndex ? local : url;
}

export const createAppMachine = ({
  navigate,
}: {
  navigate: NavigateFunction;
}) =>
  createMachine(
    {
      /** @xstate-layout N4IgpgJg5mDOIC5QEMAOqDEBXVFkBcwACAYywCdywA7fAQRPwEsA3J-ATwG0AGAXUShUAe1jsmw6oJAAPRAFYAHIoB0PeQDZFAZgBMAFgCch3QEZFAdgA0IDogC0p7SsPL5F9Yf3nd2pwF9-GzRUFQBhAAswEgBrIgoAGwxeASQQETFmSWk5BHttbXkVXV1lDQtFXUMfXQ0bOwRTcxV9bQt5Uw0S030ebUtA4PRwqNj48iSuU1ShUXFstNz8pxb5fQqnfUsm+sQulTbTHl0eI-15eR4TQZAQlQAZYWQIIgAzcmEAW3GkqmfufjSDLzKSLPb7Pz6c4aXrVbRaXaNCymFQ6PSmXTyNo8Sq+G53R7PN4fb6JFQANWQCSYeEIPyItOQyUBaWBWVBoFynQsxR4FgstSO5m8in0iMxPO0+lKBXU-UU5g0+OGhJe7y+PwpVJpBGIiQZBCZUxm6Tm7JyiHMPBUAuMPA0-R6pkMfUR8J5OhMJT58lcnX0ytCquJGrJAGUIsIAO5EFja2kSahEMCUYTkbATUgRZDUGAQFJAs2Ji15Kq6A44gwaJq+mG6ay2RBQnn6DTqfkaTTw6oBoK3YYMZhsTgYEgJMDIchEahgGT4IjIRisdgAk1s4tgxqWfQuTTuQodCznUyI1vl53qPrI4xaXtDUKD5ecFQAETAhHInyYM+ns-ni6HFdmTXIsFk5S0rg0NR+S9HpLHdcV3AOaU0ROHFTAsQxAxUR9hw4V93xTL8fxnOcFyXPDkmmQtMg3cDGj5KDfRKPxyh4Vo3TWVFLAVfk+nRRRsNwlcCI-YjiFI-8KKArhdBA2iwNkCCDDUY5akuHgcVdRsEHOIoTHKHoNC6RQYVMITpOfN8xO-CS-3IwCRy4bR5JBEsjk0G1cT3X13AsbREQuFE2hhZEoT6LwLAsxz8OsojbN-MiAKfDhkn0VzzU3DyoIqApzEMZE9CxREYUMYpqkUTTYWbaKUtE+KSPs5LKK4eQMropSEEqKCipKUoYShSpEQVZwSmqGD+Q8VxarwlQABV7NgakIDADAIEkMAVG-FhhBiTbCDnMNlrAABZRcIlsgtWVAjlOqMncoWYkyei8XREU6VRtC0wx+k7HFWl7PtqGEFb4DSEIaLczd7A6KCDJMWGLGrRFHFOA4mi2WFakMYzdGwyJojiRJIcy+j7FbVR4cxbk22MBsGhrVF5FKBUtk6U5-Ow4N1VJCYSY6pYjh5YVTL8VxPXMd6PDUZ1xtMo93HULmnjVElNUpZbdXpRl+cUpZfRUEWHWdZRtAqxCysUZnlDg9mMLvfsgxVkNeYSEZCYXagXlgd9ddu3I2mcaUpROLxzDWOodMxS3ra0PpWfYpU+wJZ2ec1CNo1jeMCETZNU3IP33IuYpSiUSojCcNpT3WQ3S+UdYzGUKLk+GMI-jpNMs2EUQwEL6G9B3J0HRMfzMIFMUdPsS32iqQP0VreQZpXPv6I7FRmZKWsDCMVxhutVwOkq+FOw8Pol6swjPwSySHJSlfOvL9e+q3qFjEURCeTtGfD5dC4HbuYSz4ACac1Yw0jAMIe+XJ+g7l8kocwlUDD00QPWFslRMJW2RMZHQi8W4PksvhBaZElrgKgZaeUxR+R6E9JVE8OlCgonOB4K2fRTitBxuffCJ0sAJGYKgccXcmAkGIAARywHAUmpoFL+3IcodeO8ZTyhdO-HSrYeS+C0MYUwh9+jaE4fNeyYiJEdXXHrchJgDg6G0VbUUFwAo6U0CibRzZNLM39PogASs8CQRAjGwEkaYmRjR+g8lHtsDGSg9AlQdC4W0aFKqXFKPoi6-i0wNFmNI9yGgLF+EvJ0X0hQfqnh0AceEBQKjIjMBifGXx+GEQgGQxoZxDY4xGrojwVRhpHBUANLEUoFRHB+thFJ+A0n31GagPYLRjLlD0H4R0sybDjlePgFBOMWiGE0KcLERg+QqIAEbCHwKMz4CgHozP8r4JwCoEQgHIEwKAERVm6U6BsrZ2ipQugqDYKMNJ8AREtCcGwUQHlPKbCo3IVQoJGHeTsr5KiGjQouXM653I9GBH8EAA */
      id: "app",

      initial: "Check url",
      predictableActionArguments: true,
      preserveActionOrder: true,
      tsTypes: {} as import("./app-machine.typegen").Typegen0,

      context: {
        currentActivity: null,
        nextActivity: null,
      },

      schema: {
        context: {} as {
          currentActivity: Activity | null;
          activityFromUrl?: Activity | null;
          urlValidationError?: {
            url: string;
          };
          nextActivity: Activity["children"][number] | null;
        },
        events: {} as
          | { type: "url changed" }
          | { type: "ready" }
          | { type: "clear next activity" }
          | {
              type: "update currentActivity";
              payload: Activity["children"][number];
            },
      },

      states: {
        "Check url": {
          always: [
            {
              target: "Load from url",
              cond: "has actitvity in url",
            },
            "Create or choose",
          ],
        },

        "Load from url": {
          on: {
            ready: "Activity",
          },

          states: {
            "Validate url data": {
              entry: "validate url data",

              always: [
                {
                  target: "Check and set",
                  cond: "has valid url",
                },
                "Show validation error",
              ],
            },

            "Check and set": {
              entry: ["set currentActivity", "raise ready"],
            },

            "Show validation error": {
              on: {
                "url changed": {
                  target: "#app.Check url",
                  actions: "log transition",
                },
              },

              exit: "clear validation errors",
            },
          },

          initial: "Validate url data",
        },

        "Create or choose": {},

        Activity: {
          states: {
            "Determine next activity": {
              entry: "determine next activity",

              always: [
                {
                  target: "YT video",
                  cond: "next is yt video",
                },
                {
                  target: "Text slide",
                  cond: "next is text slide",
                },
                {
                  target: "Multiple choice question",
                  cond: "next is multiple choice question",
                },
                {
                  target: "Text question",
                  cond: "next is text question",
                },
                {
                  target: "Radio question",
                  cond: "next is radio question",
                },
                {
                  target: "#app.Completed",
                  cond: "all is completed",
                },
              ],
            },

            "YT video": {},

            "Text slide": {
              invoke: {
                src: "text slide machine",
                id: "textSlideMachine",
                onDone: "Determine next activity",
              },
            },

            "Multiple choice question": {},
            "Text question": {},
            "Radio question": {},
            history: {
              type: "history",
              history: "deep",
            },
          },

          initial: "Determine next activity",

          on: {
            "clear next activity": {
              target: ".history",
              actions: "clear next activity",
            },
          },
        },

        Completed: {},
        history: {
          type: "history",
          history: "deep",
        },
      },

      on: {
        "update currentActivity": {
          target: ".history",
          actions: "update currentActivity",
        },
      },
    },
    {
      actions: {
        "validate url data": assign((context, event) => {
          const locationHash = window.location.hash;

          let urlData;
          try {
            urlData = JSON.parse(decodeURIComponent(locationHash.substring(1)));
          } catch {
            return {
              urlValidationError: {
                url: window.location.href,
              },
            };
          }
          return {};
        }),
        "set currentActivity": assign((context, event) => {
          // Get from location
          const locationHash = window.location.hash;
          let urlData: Activity | null = null;
          try {
            urlData = JSON.parse(decodeURIComponent(locationHash.substring(1)));
          } catch {
            console.error(`Error parsing urlData`);
          }

          if (urlData) {
            // Check if in local DB
            const localString = localStorage.getItem(urlData.id);

            // If in local DB, check which one to use, local or url
            if (localString) {
              let localData: Activity | null = null;
              try {
                localData = JSON.parse(localString);
              } catch {
                console.error(`Error parsing localData`);
              }

              if (localData) {
                return {
                  currentActivity: findMostProgress({
                    url: urlData,
                    local: localData,
                  }),
                };
              } else {
                return {
                  currentActivity: urlData,
                };
              }
            }
            return {
              currentActivity: urlData,
            };
          }

          return {};
        }),
        "log transition": (context, event) => {
          console.log(event);
        },
        "clear validation errors": assign((context, event) => {
          return {
            urlValidationError: undefined,
          };
        }),
        "raise ready": raise({ type: "ready" }),
        "update currentActivity": assign((context, event) => {
          console.log(`update currentActivity`, event.payload);
          if (context.currentActivity) {
            const updatedActivity = context.currentActivity.children.map(
              (child) => {
                if (child.id === event.payload.id) {
                  return event.payload;
                }
                return child;
              },
            );

            return {
              currentActivity: {
                ...context.currentActivity,
                children: updatedActivity,
              },
            };
          }
          return context;
        }),
        "clear next activity": assign((context, event) => {
          return {
            nextActivity: null,
          };
        }),
        "determine next activity": assign((context, event) => {
          if (context.currentActivity) {
            const nextActivity = context.currentActivity.children.find(
              (child) =>
                child.status === "not started" ||
                child.status === "in progress",
            );

            return {
              nextActivity,
            };
          }
          return context;
        }),
      },
      guards: {
        "has actitvity in url": (context, event) => {
          const locationHash = window.location.hash;
          if (locationHash && locationHash.length > 1) {
            return true;
          }
          return false;
        },
        "has valid url": (context, event) => !context.urlValidationError,
        "next is yt video": (context, event) => {
          return context.nextActivity?.type === "yt-video";
        },
        "next is text slide": (context, event) => {
          return context.nextActivity?.type === "text-slide";
        },
        "next is multiple choice question": (context, event) => {
          return context.nextActivity?.type === "multiple-choice-question";
        },
        "next is text question": (context, event) => {
          return context.nextActivity?.type === "text-question";
        },
        "next is radio question": (context, event) => {
          return context.nextActivity?.type === "radio-question";
        },
        "all is completed": (context, event) => {
          return (
            context.currentActivity?.children.filter(
              (child) => child.status !== "done",
            ).length === 0
          );
        },
      },
      services: {
        "text slide machine": (context, event) => {
          console.log(`text slide machine`, context);
          if (
            context.nextActivity &&
            context.nextActivity.type === "text-slide"
          ) {
            console.log(
              "createTextSlideMachine",
              JSON.stringify(context.nextActivity),
            );
            return createTextSlideMachine({
              textSlide: context.nextActivity,
            }) as AnyStateMachine;
          } else {
            throw new Error(`Invalid nextActivity`);
          }
        },
      },
    },
  );
