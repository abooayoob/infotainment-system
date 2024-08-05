import { createMachine, assign, raise } from "xstate";

import { NavigateFunction } from "react-router-dom";
import { Activity } from "./types";

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
      /** @xstate-layout N4IgpgJg5mDOIC5QEMAOqB0BhAFmAxgNYAEArgE4A2AxANoAMAuoqKgPawCWALp2wHYsQAD0QBaAMwSArBgBMcgByKAbAHZFcgJwBGTXJUAaEAE9EOvRgAsEtdJ0qFOq-QmK1AXw-G0mXARIKGlodZiQQdi5eASFRBEkdCWtpKw1Eq3cLYzMERwxbHXo5ekKraWl6LTkvH3QMABk2ZAhiADNyNgBbMipqcjBmkwYw1g4ePkFwuJVpFQwtRQkqtS16VPpFK2zzNR0MRYk5QvoUxR0DT28QXwamlvaunsoMADVkSk4IZG4wJ+Iv7jIOhMISRcYxKbmdTyehqNQGQp6KxI7YIOTSNT5KxKKQnNxnVQ1a51RrNNodbpBV7vT7fX5Bf7fIEhEYRMbRSagOJ6egYeFaVYqNzOHSrCSoiTQxZVBSw6QLBxWIk3Un3ClPDAAZRwbAA7sQAG40gETYhgcgdcjUBn4HDIfgwCDDUHsiaxcTaOT5DZyKwqCzylTYtSoqypawqE5wmZClS6JVE-hsCBwIS+F1RN2Q+L2OZVOPohxqf2osRaTGi-QORaOPTSZV1fxEJ4Z8GckTiP2KeYGKq54uVcuogP7aRKM4ZBwlNQSBuYVXkx5BVsc93xQoVzaqCSV6V6YdqXklAUnQoSVKBue3MkPSlUakfAH0qiMwErrNc8TyjBI7e7pb7qYiDoloo7js4ZyRjoagJrU853Iud7PE2JD2i0sBgNw74Qp+CC2Ek2LnsUWjIooKRGEBaLfmRSgqIorgTmsKhXgut4atqeqGsa3ymualrYe23LlPISjSMovq6FIIaUWGFaicoqRHMolxwdg-R0sQbDkMQtpsBwYACWuki+j+yJCsstjlr6page4Y5aPhhw6IG9ZXDcACC+C8AaPA5KMmY4R2CDRhgY4KIGvpWAKigHnsFQWNKmgrCczFeB4QA */
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
        events: {} as { type: "url changed" } | { type: "ready" },
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
        Activity: {},
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
