import { NextRequest, NextResponse } from "next/server"
import { AuthorizationCodeRequest } from "@azure/msal-node"
import { msalInstance } from "@/app/msalInstance"

//Need to pull these from ENV with a provision for development vs production
let redirectUri = process.env.REDIRECT_URI_PROD || ""
let redirectRoute = process.env.LOGIN_REDIRECT_ROUTE_PROD || ""

if (process.env.NODE_ENV == "development") {
  redirectUri = process.env.MSAL_REDIRECT_URI_DEV || ""
  redirectRoute = process.env.LOGIN_REDIRECT_ROUTE_DEV || ""
}

export const GET = async (request: NextRequest) => {
  try {
    //Retrieve the authorization code from the query string
    const authCode = request.nextUrl.searchParams.get("code")
    const pkceVerifier = request.cookies.get("pkceVerifier")

    //Shut Typescript up. Also send a friendly error message i guess :eyeroll:
    if (!authCode || !pkceVerifier) return new NextResponse("Missing authorization code or PKCE verifier.", { status: 400 })
    
    //Pull the actual string out of the cookie
    const pkceVerifierValue = pkceVerifier.value
    
    //Build the token request with the authorization code & verifier string
    const tokenRequest: AuthorizationCodeRequest = {
      scopes: ["user.read"],
      redirectUri: redirectUri,
      code: authCode,
      codeVerifier: pkceVerifierValue
    }

    //Retrieve the token
    const response = await msalInstance.acquireTokenByCode(tokenRequest)

    //Redirect the user and set JWT in a cookie on the response
    const res = NextResponse.redirect(redirectRoute)
    res.cookies.set('idToken', response.idToken)
    return res

  } catch (err) {
    //Error handling
    if (err instanceof Error) return new NextResponse(err.message, { status: 500 })
    return new NextResponse("unknown error", { status: 500 })
  }
}