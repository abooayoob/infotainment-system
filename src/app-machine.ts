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
    (c) => c.status !== "not started"
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
      /** @xstate-layout N4IgpgJg5mDOIC5QEMAOqDEBXVFkBcwACAYywCdywA7fAQRPwEsA3J-ATwG0AGAXUShUAe1jsmw6oJAAPRAFYAHIoB0PeQDZFAZgBMAFgCch3QEZFAdgA0IDogC0p7SsPL5F9Yf3nd2pwF9-GzRUFQBhAAswEgBrIgoAGwxeASQQETFmSWk5BHttbXkVXV1lDQtFXUMfXQ0bOwRTcxV9bQt5Uw0S030ebUtA4PRwqNj48iSuU1ShUXFstNz8pxb5fQqnfUsm+sQulTbTHl0eI-15eR4TQZAQlQAZYWQIIgAzcmEAW3GkqmfufjSDLzKSLPb7Pz6c4aXrVbRaXaNCymFQ6PSmXTyNo8Sq+G53R7PN4fb6JFQANWQCSYeEIPyItOQyUBaWBWVBoFynQsxR4FgstSO5m8in0iMxPO0+lKBXU-UU5g0+OGhJe7y+PwpVJpBGIiQZBCZUxm6Tm7JyiHMPBUAuMPA0-R6pkMfUR8J5OhMJT58lcnX0ytCquJGrJAGUIsIAO5EFja2kSahEMCUYTkbATUgRZDUGAQFJAs2Ji15Kq6A44gwaJq+mG6ay2RBQnn6DTqfkaTTw6oBoK3YYMZhsTgYEgJMDIchEahgGT4IjIRisdgAk1s4tgxqKLE2rpt7xddSmBsNLb6FymDpmeQnDSGLqBlSD5ecFQAETAhHInyYM+ns-nRchxXZk1yLBZOUtK4NDUfkvR6Sx3XFdwDmlNEThxY9DEfZ9hw4d9PxTH8-xnOcFyXPDkmmQtMg3SDGj5GDfRKPxyh4Vo3TWVFLAVfk+nRRQcIolcCK-YjiFIwDhJHLhdDA2iINkKCDDUY5akuHgcVdRsEHOIoTHKHoNC6RQYVMITgNfD8xN-CSAPIyyOGSbR5JBEsjk0G1cU0C5DHcCxtERC4UTaGFkShPovAsCyX3w6yiNs-8yKA2Lkn0VzzU3DyYIqApzEMZE9CxREYUMYpqkUTTYWbGK8NEhKSPslLKK4eQMropSEEqGCipKUoYShSpEQVZwSmqOD+Q8VxapEgAVezYGpCAwAwCBJDAFRfxYYQYg2wg5zDJawAAWUXCJbILVlwI5TqjPPKFmJMnovF0RFOlUbQtMMfpOxxVpez7ahhGW+A0hCGi3M3ewOhggyTBhixq0RRxTgOJptHvbF1ihR9ImiOJEghzL6PsVtVDhzFuTbYwT0tS9URvZQEM6U4AsfYN1VJCYiY6pYjh5YVTL8VxPXMN6PDUDC+XrdpFAK6K+wJJ41RJTVKSW3V6UZHnFKWX0VEFh1nWUDGxZ0zEyu3UoFS2Fnj17IYg2VkMuYSEZ8YXagXlgT8dZu3I2mcaUpROLxzDWOpzf1q3TMqx1elbdnnc5zUI2jWN4wIRNk1Tcg-fci5ilKJRKiMJw2kRZsDeL5R1jMZQFcd8I-jpNMs2EUQwHzqG9HPJ0HRMAKLAKgxkct9oqkD9Fa3kGbOG7+iOxUG8SlrAwjFcYbrVcG8tBxSwvVnxWB2kuLCO-RLJIc2KF860vl76teoWMRRkJ5O0J46OX1DWOf8IATVmrGGkYBhC3y5P0c8voLgKmUMcdY4p+QtEqMPbcyJjI6CPk3XCc0FpHXAZaeUxR+R6E9JVUwnEUTnA8NuPopxWj3j-ioY6WAEjMFQOOduTASDEAAI5YDgMTU0Cl-aEOUMvDeMp5QulfjpVsPJfBaGMJecw-RtBMPmmRfhgiOrrl1oQkwBwdCXm3KKC4gUdKaBRJeZsmkbz+iYQAJWeBIIg2jYBCL0aIxo-QeRD22E0c4OhXo6WMs4EeJhNKVUuKUJh50PFpgaLMER7k7zlj8OoU4nZvq+gsaeHQBx4QFAqMiMwGJcZfA4YRCABDGhnANveEaaiPBVGGkcFQA0sRSgVEcb6j54n4ESbfQZqA9gtGMuUPQfhHSTJsOOV4+BEBVBgkYTQpwsRGD5LIgARsIfAgzPgKHuhMgKvgnAKgRCAcgTAoAREWbpToLQ-JtkvFKF0FQbBRhpPgCIloTg2CiDcu5TZZG5GWU8tZrzNkfNCeM4ypzpkXLZoEfwQA */
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
              }
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
                child.status === "not started" || child.status === "in progress"
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
              (child) => child.status !== "done"
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
              JSON.stringify(context.nextActivity)
            );
            return createTextSlideMachine({
              textSlide: context.nextActivity,
            }) as AnyStateMachine;
          } else {
            throw new Error(`Invalid nextActivity`);
          }
        },
      },
    }
  );
