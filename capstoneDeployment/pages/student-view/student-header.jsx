import React from 'react'
import { BsGearWideConnected } from 'react-icons/bs'
import Link from 'next/link'

const StudentHeader = () => {
  return (

    <div className="flex-col flex text-slate-800 bg-white content-center self-center">
      <Link className="font-bold flex text-4xl hover:text-slate-500 self-center" href="/student-view/student-landing">
        UES Connect
        <BsGearWideConnected className="ml-3"></BsGearWideConnected>
      </Link>
      {/* <div className="text-md ml-1">Explore UES Club Positions</div> */}
    </div>


  )
}

export default StudentHeader
