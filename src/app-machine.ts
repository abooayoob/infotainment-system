import { createMachine, assign, raise } from "xstate";

import { NavigateFunction } from "react-router-dom";
import type { Activity } from "./types";

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
      /** @xstate-layout N4IgpgJg5mDOIC5QEMAOqB0BhAFmAxgNYAEArgE4A2AxANoAMAuoqKgPawCWALp2wHYsQAD0QBaAMwSArBgBMcgByKAbAHZFcgJwBGTXJUAaEAE9EOvRgAsEtdJ0qFOq-QmK1AXw-G0mXARIKGlodZiQQdi5eASFRBEkdCWtpKw1Eq3cLYzMERwxbHXo5ekKraWl6LTkvH3QMABk2ZAhiADNyNgBbMipqcjBmkwYw1g4ePkFwuJU8iWcylRddCRVFbPM1HQxFKTkdOWlben0JGpBfBqaW9q6eygwANWRKTghkbjA74jfuZDomISRcYxKbmdTyehqNQGQp6Kxw9YIA5qfJWJRSeiHZR6FRnC6NZptDrdIKPZ6vd6fILfd5-EIjCJjaKTUBxPT0DDQrRaegqNzOHQ8iSIlYonZVBSQ6RaRQOKx4uoE67Eu4YADKODYAHdiAA3ck-CbEMDkDrkajU-A4ZD8GAQYaApkTWLibRyfLHORWFQWaWLORqRFWVLWFSYqEqaR8lS6eXec7oC2oH6ffAUfr8bgAQXwvF1PCGAPCQOZLoQ0mUGExqwkXu5e3ciLEiQwMsU0jUmK08M0c1O8YuObzBYwABEwB9yJ1OPxPrPhNxiMhc5x89wTP8GSXnaCEIUtCoq1CJc53KLEcjUeja-Rjjo1FoFZgh6uR+PJ9PZ8R54vl8P13QoSOlEO6suYkKHtKChzOo9A2CKKTbO4spQq4tZ6E+GAvmuJhjhOJqfnOYALkuK44XQchbk6IJgXuRRWFWRQGBUt6KK4QblK2BibN6jiqPCmHYW++FTjOREkX+r4AbQEhUSBNEiOBUacmx0LesxFRyIi0helW94yAGkYVqoglkcJH5id+xG-mZ0lWHJwIsopdHKRokJeo4RlFIiYYolIaiRmoqSYjIuIDnUQnrnhFlfj+pH-hutDSA5pa7poh61jpCj8cGmiIrKSQKLox5Qp2MpePG-BsBAcBCL4wGOWWYj2IeVQxgcDgBToTawvkFjBfCEhaCsFaYf4RB3A1qW0WI3qKFx7UtQFlRaIGpjmDosjtkosoZA4JRqP2tSYEqRK3EEU2gc5zaQhgcKqHMbZDXoiL3hyJTcoUFSDYo5XhSdVxnSSVBki8KZfD8yCXQpcTNVod2KBkfKCsoz1rOtSLStsOnYntYb3nGx2XISNzA-c40kDaLSwBO0NOXEthJGiEhopUPYpEYGMHPD22qGx-IuN6mGnaTqoatqeoGu8RommadNlptsjZcZdaJLYQYhvs7bKKkDbuGN-SUsQbDkMQVpsBwYDy7uki6QKfJVIdD5qU2PN2NojPoX60imQl1u0RGGBZdzjjBty6M5Pssgxpit5KAFNhhUTkW4e+BGWXFkk4f7zmaAxwd+l6VjhxeHatjy7v2L9mIpL7Um4QAmgAKnqrxgGwOdsm4+daOUsrKPRa05AGKIZAGModg4NY+-9WG2bhTfWcQsBg1bxbUfT5huGKD4ypiBxuCKdhViPOyQvC0IHHXOEYAAsqQlC8KglCppqnD4J8ACOpBwNNjLyZvPc28EZ7BKGUHSdgrAcSSCzYoHZoTwN7p4WeKcMCLxIt-X+V1twwy3qoUMRUUjBiOEPRAOktg2AML3TQ7Y4LXxHAAJWaHwYgmDYB-xwYAxI7hOQrBlA+KQbhhQYzDAxOwEgiiOE7IdH0Y0ujP3whATuG04J3QPAVIRnZtD5UKBgRYZQpB7X3EdBMmAcCcHYSbHIowAFCG4GwVAiBDy8XULWPsspXHGBfq0bgiBtDON7vjQ4xdITowAEZsG4PYzoZCGIuMOnIdxDh0bkE4FAHAviEDwgCVGEowSK7oy1K8bgOBzDFGMHgNJGTEAZGMHEfx1hAl5JZgUnyoYZgJKSa4iqHggA */
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
                  actions: "clear next activity",
                },
                {
                  target: "Text slide",
                  cond: "next is text slide",
                  actions: "clear next activity",
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
            "Text slide": {},
            "Multiple choice question": {},
            "Text question": {},
            "Radio question": {},
          },

          initial: "Determine next activity",
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
          console.log(`locationHash: ${locationHash}`);
          console.log(
            `decodedUriComponent: ${decodeURIComponent(locationHash)}`
          );
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
    }
  );
