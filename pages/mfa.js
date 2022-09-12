import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import {auth} from '../lib/Store'
import { useRouter } from 'next/router'



export default function Home() {
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  auth.onAuthStateChange((event, session)=> {
    if (event == 'SIGNED_IN') {
      console.log('SIGNED_IN now', session)
      router.push('/mfa')
    }
  })
  const handleLogin = async (type, username, password) => {
    try {
      const { error, data: { user } } =
        type === 'LOGIN'
          ? await auth.signInWithPassword({ email: username, password })
          : await auth.signUp({ email: username, password })
      // If the user doesn't exist here and an error hasn't been raised yet,
      // that must mean that a confirmation email has been sent.
      // NOTE: Confirming your email address is required by default.
      if (error) {
        alert('Error with auth: ' + error.message)
      } else if (!user) alert('Signup successful, confirmation mail should be sent soon!')
    } catch (error) {
      console.log('error', error)
      alert(error.error_description || error)
    }
  }

  return (
    <div className="w-full h-full flex justify-center items-center p-4 bg-gray-300">
      <div>An MFA page</div>
    </div>
  )
}
