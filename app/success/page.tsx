import React from 'react'
import { cookies } from 'next/headers'

type Props = {}

const Success = (props: Props) => {
  const usernameCookie = cookies().get('username')
  const username = usernameCookie ? usernameCookie.value : 'Email not found'

  return (
  <div className="flex items-center justify-center min-h-screen bg-zinc-900">
    <div className="p-8 rounded-lg shadow-lg max-w-sm w-full text-center bg-zinc-800">
      <p>You're logged in as {username}</p>
    </div>
  </div>
  )
}

export default Success