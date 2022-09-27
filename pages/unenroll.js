import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import {auth} from '../lib/Store'
import { useRouter } from 'next/router'
export default function Unenroll() {
  const router = useRouter()


  const [totpCode, setTotpCode] = useState('')
  const [factors, setFactors] = useState([]);
  const [loading, setLoading] = useState(false)
  const listFactors = async () => {
      const {data: factors} = await auth.mfa.listFactors()
    setFactors(factors.factors)


  }

  useEffect(() => {
    listFactors().catch(console.error)

  },[])


  async function unenroll () {
    const factorId = document.getElementById("factor_id").value;
    const code = document.getElementById("totp").value;

    const {data: factors} = await auth.mfa.unenroll({code: code, factorId: factorId})
  }


  return (
    <div className="w-full h-full flex justify-center items-center p-4 bg-gray-300">

    <div className="p-4 w-full max-w-sm bg-white rounded-lg border border-gray-200 shadow-md sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">


    <form className="space-y-4" action="#">
        <h3 className="text-xl font-medium text-gray-900 dark:text-white">Unenroll Factor</h3>
        <h4><b>Factor Details</b></h4>
      <div className="outline-black outline-2">
        <table>
          <tbody>
    <tr>
    <th>Friendly Name</th>
    <th>Factor ID</th>
    <th>Type</th>
    <th>Status</th>

    </tr>
      {factors.map((factor, index) => (
       <tr key={index}>
         <td> {factor.friendly_name ?? "None"}</td>
         <td> {factor.id} </td>
         <td> {factor.factor_type}</td>
        <td> {factor.status}</td>
       </tr>))}

    </tbody>

    </table>

      </div>
        <div>
            <label htmlFor="factor_id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Factor ID</label>
            <input type="input"  name="factor_id" id="factor_id" placeholder="" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required=""></input>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">TOTP Code</label>
            <input type="password"  name="password" id="totp" placeholder="" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required=""></input>
        </div>

    </form>
      <button type="submit" onClick={unenroll} className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 py-1">Unenroll</button>
    </div>

    </div>
  )
}
