import React from 'react'
import { BsGearWideConnected } from 'react-icons/bs'
import Link from 'next/link'

const StudentHeader = () => {
  return (
    <div className="flex-col flex text-slate-800 w-4/5 pl-8">
      <Link className="font-bold flex text-4xl mt-2 hover:text-slate-500" href="/student-view/student-landing">
        UES Connect
        <BsGearWideConnected className="ml-3"></BsGearWideConnected>
      </Link>
      <div className="text-2xl">Explore UES Club Positions</div>
    </div>
  )
}

export default StudentHeader
