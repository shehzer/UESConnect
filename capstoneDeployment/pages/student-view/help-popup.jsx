import React from 'react'
import { RiAdminLine, RiInformationLine } from 'react-icons/ri'
import { FaHeart } from 'react-icons/fa'

const HelpPopUp = (props) => {

  function turnOff(event){
    event.preventDefault()
    props.setShowGreeting(false)
  }

  return (
    <div className=" fixed top-0 w-full h-full bg-white bg-opacity-60 flex-col flex justify-center items-center">
      <div className=" fixed bg-gray-800 text-white py-2 px-4 rounded-lg opacity-100 top-40 ">
        <p className="py-1 text-xl font-bold">
          Welcome to UES Connect! Your home to browse available positions
          at Engineering clubs on Campus!
        </p>
        <p className="py-1">
          Click on a club to view the available positions, then click
          'apply' to apply!
        </p>
        <div className="flex py-1">
          Click
          <FaHeart
            color="white"
            className="text-white text-3xl mx-2"
          ></FaHeart>{' '}
          to like Clubs. You can then click the heart in the menu to filter for clubs you have liked
        </div>
        <div className="flex py-1">
          Click on{' '}
          <RiInformationLine
            color="white"
            className="text-white text-3xl mx-2"
          ></RiInformationLine>{' '}
          for help
        </div>
        <div className="flex py-1">
          Click on the Browse {props.page} Button to toggle between browsing by club or positions
        </div>
        <div className="flex py-1">
          Click on{' '}
          <RiAdminLine
            color="white"
            className="text-white text-3xl mx-2"
          ></RiAdminLine>{' '}
          if you are a club adminitrator to navigate to the Club View
        </div>
        <button
          className="bg-white text-gray-800 py-2 px-4 rounded-lg mt-2 self-center w-full font-bold hover:bg-slate-200"
          onClick={turnOff}
        >
          Close
        </button>
      </div>
      <div className="h-3/4 w-full "></div>
    </div>
  )
}

export default HelpPopUp
