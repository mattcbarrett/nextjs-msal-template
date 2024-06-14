import { Configuration, LogLevel } from "@azure/msal-node"

export const msalConfig: Configuration = {
  auth: {
      clientId: process.env.MSAL_CLIENT_ID || "",
      authority: process.env.MSAL_AUTHORITY || "",
      clientSecret: process.env.MSAL_CLIENT_SECRET || ""
  },
  system: {
    loggerOptions: {
        loggerCallback: (level: {}, message: string, containsPii: boolean) => {
          //If there's pii, don't log, just return
          if (containsPii) {
            return
          }
          //Log based on message level
          switch (level) {
            case LogLevel.Error:
              console.error(message)
              return
            case LogLevel.Info:
              console.info(message)
              return
            case LogLevel.Verbose:
              console.debug(message)
              return
            case LogLevel.Warning:
              console.warn(message)
              return
            default:
              return
          }
        }
    }
  }
}