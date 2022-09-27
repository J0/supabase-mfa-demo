import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import {auth} from '../lib/Store'
import { useRouter } from 'next/router'


// export async function getServerSideProps() {
//   console.log(auth)
//   const response = await auth.getUser()

//   const { user } = response;

// //  // If the `getUser` endpoint doesn't have a user in its response
// //  // then we will redirect to the login page
// //  // which means this page will only be viewable when `getUser` returns a user.

// //   if (!user) {
// //     return {
// //       redirect: { destination: "/", permanent: false },
// //     };
// //   }
// //   // We'll pass the returned `user` to the page's React Component as a prop
//    return { props: { user } };
//  }


export default function Enroll() {
  const router = useRouter()
  const [aal, setAAL] = useState();

  const [totpCode, setTotpCode] = useState('')
  const [qrCode, setQRCode] = useState('')
  const [uri, setURI] = useState('')
  const [factorId, setFactorId] = useState('')

  useEffect(() => {
    enroll()
  },[])



  async function enroll() {
    const {error, data} = await auth.mfa.enroll({friendlyName: '', issuer: 'supabase.com', factorType:'TOTP'})
    if (!error && data.TOTP) {
      setQRCode(data.TOTP.qr_code)
      setURI(data.TOTP.uri)
      setFactorId(data.id)
    }
  }
  async function verify() {
    const code = document.getElementById("totp").value;
    const {error: error, data: data } = await auth.mfa.challenge({factorId: factorId})
    if(!error) {
      console.log(error)
    }
    const {error:otherError, data:otherData} = await auth.mfa.verify({factorId: factorId, challengeId: data.id, code: code})
    router.push('/unenroll')
    return data
  }
  return (
    <div className="w-full h-full flex justify-center items-center p-4 bg-gray-300">

      <div className="p-4 w-full max-w-sm bg-white rounded-lg border border-gray-200 shadow-md sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <button onClick={enroll}>Generate QR  </button>
        <form className="space-y-4">
          <h5 className="text-xl font-medium text-gray-900 dark:text-white">Enroll Factor</h5>
          <div>
            <img className="p-8 rounded-t-lg" src={qrCode} alt="product image" />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">TOTP Code</label>
            <input type="password" name="totp" id="totp" placeholder="" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"></input>
          </div>

          <button type="button" onClick={verify}className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 py-1">Complete Enrollment</button>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
            Lost your device? <a href="#" className="text-blue-700 hover:underline dark:text-blue-500">Use a recovery code</a>
          </div>
        </form>
      </div>

    </div>
  )
}
