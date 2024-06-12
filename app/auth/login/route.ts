import {  NextResponse } from "next/server"
import { cookies } from "next/headers"
import { CryptoProvider, AuthorizationUrlRequest } from "@azure/msal-node"
import { msalInstance } from "@/app/msalInstance"

const cryptoProvider = new CryptoProvider()

export const GET = async () => {
  try {
    //Generate verifier and challenge codes
    const { verifier, challenge } = await cryptoProvider.generatePkceCodes()

    //Instantiate an object to pass to Azure AD
    const authCodeUrlParams: AuthorizationUrlRequest = {
      scopes: ['user.read'],
      redirectUri: 'http://localhost:3000/auth/redirect',
      codeChallenge: challenge,
      codeChallengeMethod: 'S256'
    }

    //Get the URL & build the response
    const authCodeURL = await msalInstance.getAuthCodeUrl(authCodeUrlParams)
    const response = NextResponse.redirect(authCodeURL)

    //Set the verifier code in a cookie and attach to the response
    response.cookies.set('pkceVerifier', verifier)

    //Redirect the user
    return response
  } catch (err) {
    if (err instanceof Error) return new NextResponse(err.message, { status: 500 })
    return new NextResponse("unknown error", { status: 500 })
  }
}