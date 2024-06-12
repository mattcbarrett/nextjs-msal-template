import { ConfidentialClientApplication } from "@azure/msal-node";
import { msalConfig } from "./msalConfig";

export const msalInstance = new ConfidentialClientApplication(msalConfig)