import React, { useState } from 'react'
import { FaHeart } from "react-icons/fa";
import Link from 'next/link'


export default function PositionCard(props) {
  const [isReadMore, setIsReadMore] = useState(true)

  console.log(props.viewOnlyLiked, 'console this hoe' + props.position.name)

  const [isLiked, setIsLiked] = useState(
    //State to track if user has liked the image
    localStorage.getItem(String(props.position.name + props.position._id)) === "true" //sets the localStorage key to the index of the image
  );

  React.useEffect(() => {
    //retrieve saved likes from local storage when a page reloads
    localStorage.setItem(String(props.position.name + props.position._id), isLiked);
  }, [isLiked]);

  const handleLike = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setIsLiked(!isLiked);
  };

  const handleReadMore = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setIsReadMore(!isReadMore)
  }

  const href = '/student-view/student-positions/'

  return (
    <div className="rounded-lg bg-white overflow-hidden m-2 text-slate-800 flex flex-col shadow-md hover:shadow-lg grow hover:animate-wiggle border border-gray-300 hover:border-gray-400">
      <div className="cursor-pointer h-full w-full flex flex-col self-start">
        <Link href={href + props.position._id} >
          <div className='flex w-full justify-between'>
            <div className='flex pt-4 self-start pl-4'>
              <img
                className="h-14 w-14 rounded-full self-center"
                src={props.position.clubLogo}
              ></img>
              <div>
                <h1 className="px-2 text-2xl font-bold cursor-pointer">
                  {props.position.name} &#x2022; <a className='font-normal'>{props.position.clubName}</a>
                </h1>
                <div className="py-1 mx-2 text-sm text-gray-900 rounded-xl font-semibold w-auto text-left">
                  Number of Openings: {props.position.numberOfOpenings}
                </div>
              </div>
            </div>
            {!props.viewOnlyLiked
              ?
              (<div>
                {/* if state isLiked is true than the like button will fill red*/}
                <button
                  onClick={handleLike}
                  className={` flex sm:opacity-0 lg:opacity-100 justify-center p-2 mr-4 mt-4 text-black hover:text-red-400 ${isLiked && "text-red-600 text-4xl"
                    } bg-none`}
                >
                  <FaHeart className="text-2xl" />
                </button>
              </div>) : null}
          </div>
          <div className="flex flex-wrap self-center bg-white space-x-2 px-4">

            {props.position.skills[0] != null
              ?
              props.position.skills.map((skill) => (
                <div className="self-center flex flex-row text-white">
                  <div className="bg-slate-500 text-base font-bold rounded-md px-2">
                    {skill.skill}
                  </div>
                </div>
              ))
              : ''}
          </div>
          <div className="pr-6 pl-6 pt-2 pb-1 mb-3 flex-col flex h-full text-slate-500 self-start">
            <div className={`text-sm ${isReadMore && 'line-clamp-2'} ${props.viewOnlyLiked && 'line-clamp-none'}`}>
              {props.position.description}
            </div>
            {!props.viewOnlyLiked ?
              <button
                onClick={handleReadMore}
                className="bg-none rounded text-sm font-bold hover:text-slate-800 text-left pt-1 self-start "
              >
                {isReadMore ? 'Read More...' : 'Read Less...'}
              </button> : null
            }
          </div>
        </Link>
      </div>
    </div>
  )
}
