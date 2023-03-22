import React from 'react'
import { BsGearWideConnected } from 'react-icons/bs'
import Link from 'next/link'

const StudentHeader = (props) => {
  return (

    <div className="flex-col flex text-slate-800 bg-white content-center self-center">
      <div className='flex-col'>
        <Link className="font-bold flex hover:text-slate-500 self-center sm:text-2xl lg:text-4xl" href="/student-view/student-landing">
          UES Connect
          <BsGearWideConnected className="ml-3 sm:opacity-0 lg:opacity-100"></BsGearWideConnected>
        </Link>
        {props.page ?
          <div className="group flex relative justify-items-center">
            <Link className='text-lg bg-slate-600 text-white rounded-lg hover:bg-slate-300 cursor-pointer px-1.5 py-0.5' href={props.href || '/student-view/student-landing'}>
              Browse {props.page}
            </Link>
            <span
              className="group-hover:opacity-100 transition-opacity bg-slate-500 text-gray-100 rounded-md absolute 
opacity-0 text-center left-1 w-40
-translate-x-2.5 translate-y-10 text-md font-semibold"
            >
              Click to Swap View, You are currently Browsing by {props.page}
            </span>
          </div>
          : null}
      </div>
    </div>
  )
}

export default StudentHeader
