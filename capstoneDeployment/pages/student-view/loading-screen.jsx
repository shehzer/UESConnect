import React from 'react'
import { FaSpinner } from 'react-icons/fa'

//Loading screen to be displayed as data is fetched from API
const APILoadingScreen = () => {
  return (
    <div className="font-bold flex justify-center text-center mx-auto mt-5 flex-col">
      <div className="text-6xl">Loading Clubs </div>
      <div className="text-7xl font-bold w-full flex justify-center pt-5">
        <FaSpinner className="animate-spin" />{' '}
        {/*used tailwind animate-spin to animate the font awesome spinner as API laods*/}
      </div>
    </div>
  )
}

export default APILoadingScreen
