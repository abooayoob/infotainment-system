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
      /** @xstate-layout N4IgpgJg5mDOIC5QEMAOqB0BhAFmAxgNYAEArgE4A2AxANoAMAuoqKgPawCWALp2wHYsQAD0QBaAMwSArBgBMcgByKAbAHZFcgJwBGTXJUAaEAE9EOvRgAsEtdJ0qFOq-QmK1AXw-G0mXARIKGlodZiQQdi5eASFRBEkdCWtpKw1Eq3cLYzMERwxbHXo5ekKraWl6LTkvH3QMABk2ZAhiADNyNgBbMipqcjBmkwYw1g4ePkFwuJU8iWcylRddCRVFbPM1HQxFKTkdOWlben0JGpBfBqaW9q6eygwANWRKTghkbjA74jfuZDomISRcYxKbmdTyehqNQGQp6Kxw9YIA5qfJWJRSeiHZR6FRnC6NZptDrdIKPZ6vd6fILfd5-EIjCJjaKTUBxPT0DDQrRaegqNzOHQ8iSIlYonZVBSQ6RaRQOKx4uoE67Eu4YADKODYAHdiAA3ck-CbEMDkDrkajU-A4ZD8GAQYaApkTWLibRyfLHORWFQWaWLORqRFWVLWFSYqEqaR8lS6eXec51ACC+F4up4JgtqB+n3wFH6-G4ydT6Yd4SBzJdCFhSRlEhlai0NjDqkRO3k5QkqTm7mOUa88f4bAgcCEvkdUWdoPi9hUGCqMYODjUPsRYi0KMFmno3ulagkXoVfjwRDu4+BLJE4m9ijnBiqM+XlXXiN922kSllGQcJT3h8uhJuEkqDPCspzEQoN0UDI+U3cU9BfNQORKbk9B2Q4GwMP8lSJW5SSeF5sy+H5kBAydWXEaUMDhVQ5hlOC1lMRADi0N8P2cWUwx0NQ41qTBsMA1V-BPG0WlgMBuFIkFyIQWwkjRTtikbPQUiMRikUoxR31URRXE-bdcXjfErhwoD7g1bU9QNd4jRNM1JIvNlynkJRpGUL1llsIMQ32TTlFSPZlE8Qy6iwfpKWINhyGIK02A4MB7MrSQvSo+E+SqPcG2hKxVxY9x3y0WT9x0P1pD-ItODTbgclGCcpMvBAIwwd8FD9L0rG5Bici4rYKgsb1XHamVITKlMKvTDAABFxJNTpOH4T55uEbhiGQUbKuqxlaocxBNCsJqFGYxxgw6xFkTnHk7EXRQeXKOMvCAA */
      id: "app",
      initial: "Check url",
      predictableActionArguments: true,
      preserveActionOrder: true,
      tsTypes: {} as import("./app-machine.typegen").Typegen0,
      context: {
        currentActivity: null,
      },
      schema: {
        context: {} as {
          currentActivity: Activity | null;
          activityFromUrl?: Activity | null;
          urlValidationError?: {
            url: string;
          };
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
            "Determine next activity": {},
          },

          initial: "Determine next activity",

          on: {
            "update currentActivity": {
              target: "Activity",
              internal: true,
              actions: "update currentActivity",
            },
          },
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
      },
    }
  );
