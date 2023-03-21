import React from 'react'
import { BsGearWideConnected } from 'react-icons/bs'
import Link from 'next/link'

const StudentHeader = () => {
  return (
    <div className="w-1/3 flex">
      <div className="flex-col flex text-slate-800 bg-white">
        <Link className="font-bold flex text-4xl hover:text-slate-500" href="/student-view/student-landing">
          UES Connect
          <BsGearWideConnected className="ml-3"></BsGearWideConnected>
        </Link>
        <div className="text-2xl">Explore UES Club Positions</div>
      </div>
    </div>

  )
}

export default StudentHeader
