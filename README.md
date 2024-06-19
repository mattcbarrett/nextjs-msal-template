## NextJS + MSAL

This is an example application that demonstrates how to implement Microsoft's msal-node package in a NextJS project for authentication with Entra ID.

Use the code as an example to get your own project working, or build on this one.

Tailwind CSS theming is purposefully minimal, expand on it or swap in your own preferred library.

## Getting Started

1. Register an Enterprise Application in the Azure portal. This also creates an App Registration in Azure.
2. Copy the Application ID into .env.local.template under the MSAL_CLIENT_ID variable.
3. Open the App Registration and create a client secret. Paste it under the MSAL_CLIENT_SECRET variable.
4. Copy your Tenant ID and paste it onto the end of the MSAL_AUTHORITY variable. The value should be: https://login.microsoftonline.com/your_tenant_id_here.
5. Add the MSAL_REDIRECT_URI_DEV value as a Redirect UI under the Authentication section of your App Registration in Azure.
6. Rename .env.local.template to .env.local
7. Launch the app: npm run dev
