import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createRemoteJWKSet, jwtVerify, errors as joseErrors } from "jose"
import { msalInstance } from "./app/msalInstance"

//Fetch public keys from JWKS url
const jwksUrl = process.env.MSAL_JWKS_URL || ''
const JWKS = createRemoteJWKSet(new URL(jwksUrl))

export const middleware = async (request: NextRequest) => {
  try {
    //Get the JWT from client's cookies
    const jwt = request.cookies.get("idToken")

    //We dont need middleware running on the auth routes.
    //Prevents redirect loops with some of the redirects below.
    if (request.nextUrl.pathname.startsWith('/auth')) return NextResponse.next()

    //If JWT not present in cookies, and path is not the auth endpoint, redirect the client to authenticate
    if (!jwt && !request.nextUrl.pathname.startsWith('/auth')) {
      return NextResponse.redirect(`${process.env.BASE_URL}/auth/login`)
    }

    //If JWT is present, verify it
    if (jwt) {
        const verifyResult = await jwtVerify(jwt.value, JWKS, { issuer: process.env.MSAL_AUTHORITY + '/v2.0' })

      //If it verifies, pull their uername from the token, store in cookie, and continue
      if (verifyResult) {
        const username = verifyResult.payload.preferred_username
        console.log(`Verified JWT for: ${username}`)
        
        const response = NextResponse.next()
        response.cookies.set('username', username as string)
        return response

      //If it doesn't verify, return the below error
      }
    }
  } catch (err) {
    if (err instanceof joseErrors.JWTExpired) {
      if (err.code === 'ERR_JWT_EXPIRED') {
        //Log to console
        console.log('JWT expired, refreshing')

        //Get the user's cached tokens
        //See: https://learn.microsoft.com/en-us/entra/identity-platform/msal-acquire-cache-tokens
        const tokenCache = msalInstance.getTokenCache()

        //Get their accounts
        const accounts = await tokenCache.getAllAccounts()

        //If no accounts found, run the user through normal login flow
        if (accounts.length === 0) return NextResponse.redirect(`${process.env.BASE_URL}/auth/login`)

        //Build the refresh request
        const refreshRequest = {
          scopes: ["user.read"],
          account: accounts[0]
        }

        //Request the new token
        const response = await msalInstance.acquireTokenSilent(refreshRequest)

        //Set cookie and continue
        //Need to add the username cookie here too
        const res = NextResponse.next()
        res.cookies.set('idToken', response.idToken)
        return res

      }
      return NextResponse.json(err.message, { status: 500 })
    } else {
      return NextResponse.json('unknown error', { status: 500 })
    }
  }
}

export const config = {
  matcher: '/:path*'
}