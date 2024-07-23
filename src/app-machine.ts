import { createMachine, assign } from "xstate";

import { NavigateFunction } from "react-router-dom";
import { Activity } from "./types";

export const createAppMachine = ({
  navigate,
}: {
  navigate: NavigateFunction;
}) =>
  createMachine(
    {
      /** @xstate-layout N4IgpgJg5mDOIC5QEMAOqB0BhAFmAxgNYAEArgE4A2AxANoAMAuoqKgPawCWALp2wHYsQAD0QBaAMwSArBgBMcgByKAbAHZFcgJwBGTXJUAaEAE9EOvRgAsEtdJ0qFOq-QmK1AXw-G0mXARIKGlodZiQQdi5eASFRBEkdCWtpKw1Eq3cLYzMERwxbHXo5ekKraWl6LTkvH3QMABk2ZAhiADNyNgBbMipqcjBmkwYw1g4ePkFwuIqMenorFRUrQokLaTUrbPMdNVmtNXUFehVpfcVpL28QfjYIOCFfIUjxmKnxexUMKpUqj4OdLbxfYYHRaTT0NRyVZqCRFRQ1EC+bB4Ig9ShPMbRSagOJiBaKL4GX4OA6VfaAtYYc5KRTOWkqEowhFIxrNNodbpBDFRCaxcSFXZ6DIqVZgxQSXSKCmQjDSbRadRg2HuKzMuqslrtLpojAANWQlE4EGQ3DAaOIxu4yG5L2xIneWhBimFouUEr0gLkpypcuUdIcjNVVyRWH6JrNbHIxHwODYHDANqxfPiEjkVhByxFVRhan2acBYkd7jlWlsUjkOlOJzVmAAgvheAA3Hg5UY81448w-DB2c5qVzrIqQqWmbayal+jIBnZBrxAA */
      id: "app",
      initial: "Check url",
      tsTypes: {} as import("./app-machine.typegen").Typegen0,
      context: {
        currentActivity: null,
      },
      schema: {
        context: {} as {
          currentActivity: Activity | null;
          urlValidationError?: {
            url: string;
          };
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
          let urlData;
          try {
            urlData = JSON.parse(locationHash.substring(1));
          } catch {
            return {
              urlValidationError: {
                url: window.location.href,
              },
            };
          }
          return {};
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
      },
    }
  );
