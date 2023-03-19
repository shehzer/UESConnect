import React from 'react'
import { BsGearWideConnected } from 'react-icons/bs'
import Link from 'next/link'

const StudentHeader = () => {
  return (
    <div className="flex-col flex">
      <div className="flex items-center text-4xl mt-2 hover:text-slate-500 self-center">
        <Link className="font-bold " href="/student-view/student-landing">
          UES Connect
        </Link>
        <BsGearWideConnected className="ml-3"></BsGearWideConnected>
      </div>
      <div className="text-2xl self-center">Explore UES Club Positions</div>
    </div>
  )
}

export default StudentHeader
