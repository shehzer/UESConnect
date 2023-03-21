import StudentCard from './student-card'
import React, { useState, useEffect } from 'react'
import APILoadingScreen from './loading-screen'
import { gql } from '@apollo/client'
import client from '../../components/apollo-client'
import StudentHeader from './student-header'
import Link from 'next/link'
import { GrUserAdmin } from 'react-icons/gr'
import StudentFooter from './student-footer'


export default function studentLanding(props) {
  const [ClubData, setClubData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showGreeting, setShowGreeting] = useState(false); // state for showing greeting popup
  
  useEffect(() => {
     // check local storage to see if user has previously visited
     const hasVisited = localStorage.getItem('hasVisited');
     if (!hasVisited) {
       setShowGreeting(true);
       localStorage.setItem('hasVisited', true);
     }
    fetchClubs()
  }, [])

  function fetchClubs() {
    const getClubs = gql`
      query GetClubs {
        getClubs {
          _id
          department
          description
          execs {
            name
            program
            role
            year
          }
          name
        }
      }
    `
    client
      .query({
        query: getClubs,
      })
      .then((result) => {
        console.log(result.data.getClubs)
        setClubData([...result.data.getClubs])
        setIsLoading(false)
      })
      .catch((e) => {
        alert(e.message)
      })
  }

  return (
    <div className="flex flex-col bg-gray-100 w-full h-full items-center relative">
      {/* Greeting popup */}
      <div className='w-full h-16 fixed bg-white'></div>
      <div className="flex fixed bg-white h-16 justify-between centent-center w-4/5">
        <StudentHeader></StudentHeader>
        <div className='flex justify-center content-center'>
          <input
            className="form-control
           
            h-7
            py-4
          text-lg
          text-center
          text-slate-700
          bg-white bg-clip-padding
          border border-solid border-slate-300
          rounded-xl
          transition
          ease-in-out
          self-center
          focus:text-slate-700 focus:bg-white focus:border-slate-800 focus:outline-none mr-6
          w-72"
            placeholder="&#x1F50E;&#xFE0E; Club Name / Department"
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <div class="group flex relative">
            <Link href="/club-view/sign-in" className='text-slate-700 hover:text-slate-100 text-2xl flex content-center'>
              <GrUserAdmin></GrUserAdmin>
              <span class="group-hover:opacity-100 transition-opacity bg-slate-500 px-1 text-sm text-gray-100 rounded-md absolute left-1/2 
    -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto">Club Admin</span>
            </Link>
          </div>
        </div>
      </div>
      {showGreeting && (
        <div className="absolute w-full h-full bg-white bg-opacity-60 flex-col flex justify-center items-center">
          <div className="bg-gray-800 text-white py-2 px-4 rounded-lg opacity-100">
            <p className='py-1 text-xl font-bold'>Welcome to UES Connect! Your home to browse avaialable positions at Engineering clubs on Campus!</p>

            <p className='py-1'>Click on a club to view the avaialable positions, then click 'apply' to apply!</p>

            <div className='flex py-1'>
            Click on <GrUserAdmin className='text-white text-3xl mx-2'></GrUserAdmin> if you are a club adminitrator to navigate to the Club View!
              </div>
            <button
              className="bg-white text-gray-800 py-2 px-4 rounded-lg mt-2 self-center w-full font-bold hover:bg-slate-200"
              onClick={() => setShowGreeting(false)}
            >
              Close
            </button>
          </div>
          <div className='h-2/4 w-full '></div>
        </div>
      )}
      <div className='w-4/5 h-full'>
        {isLoading ? (
          <APILoadingScreen />
        ) :
          <div className='grid grid-cols-3 grid-flow-row pt-16 pb-12 min-h-screen '>
            {(
              ClubData.filter((data) => {
                if (searchTerm === '') {
                  return data
                } else if (
                  data.name?.toLowerCase().includes(searchTerm?.toLowerCase()) || data.department?.toLowerCase().includes(searchTerm?.toLowerCase())
                ) {
                  return data
                }
              })
                .slice(0)
                .map((data, index) => (
                  <StudentCard key={index} index={index} data={data} />
                ))
            )}
          </div>
        }
      </div>
      <StudentFooter></StudentFooter>
    </div>
  )
}
