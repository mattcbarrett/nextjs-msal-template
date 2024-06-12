import { Configuration } from "@azure/msal-node"

export const msalConfig: Configuration = {
  auth: {
      clientId: process.env.MSAL_CLIENT_ID || "",
      authority: process.env.MSAL_AUTHORITY || "",
      clientSecret: process.env.MSAL_CLIENT_SECRET || ""
  },
  system: {
      loggerOptions: {
          loggerCallback(loglevel, message, containsPii) {
            if (!containsPii) {
              if (loglevel === 0) {
                console.error(message)
              }
              if (loglevel === 1) {
                console.warn(message)
              }
              if (loglevel === 2) {
                console.info(message)
              }
              if (loglevel === 3) {
                console.log(message)
              }
            } else {
              return
            }
          },
          piiLoggingEnabled: false,
          logLevel: 0,
      },
      proxyUrl: "",
      customAgentOptions: {},
  }
}