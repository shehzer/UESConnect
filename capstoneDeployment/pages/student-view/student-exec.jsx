import React from 'react'

const StudentExecCard = (props) => {
  return (
    <div className="my-2 bg-slate-50 shadow-md text-black m-1 p-2 self-center flex-wrap">
      <div className="flex items-center">
        <div className="shrink-0">
          <a>
            <span className="sr-only">{props.data.name}</span>
            <img
              className="h-10 w-10 rounded-full"
              src={props.data.headshotURL}
            ></img>
          </a>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-skin-inverted">
            <a className="hover:underline">{props.data.name}</a>
          </p>
          <div className="flex space-x-1 text-xs">
            <span className="">{props.data.role}</span>
            <span aria-hidden="true">·</span>
            <span className="">{props.data.program}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentExecCard
