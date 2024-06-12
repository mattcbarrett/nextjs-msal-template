import React from 'react'
import { cookies } from 'next/headers'

type Props = {}

const Success = (props: Props) => {
  const usernameCookie = cookies().get('username')
  const username = usernameCookie ? usernameCookie.value : 'Email not found'

  return (
    <>
      <div>Success!</div>
      <div>Your username is: {username}</div>
    </>
    
  )
}

export default Success