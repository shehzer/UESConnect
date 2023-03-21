import StudentCard from './student-card'
import React, { useState, useEffect } from 'react'
import APILoadingScreen from './loading-screen'
import { gql } from '@apollo/client'
import client from '../../components/apollo-client'
import StudentHeader from './student-header'

export default function studentLanding(props) {
  const [ClubData, setClubData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  useEffect(() => {
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
      <div className='w-full h-32 fixed bg-white'></div>
      <div className='w-4/5 h-full'>
        <div className="ml-3 flex flex-col fixed bg-white h-32 w-4/5 justify-center ">
          <StudentHeader></StudentHeader>
          <div>
            <input
              className="form-control
            mt-1
          text-lg
          text-center
          text-slate-700
          bg-white bg-clip-padding
          border border-solid border-slate-300
          rounded-xl
          transition
          ease-in-out
          focus:text-slate-700 focus:bg-white focus:border-slate-800 focus:outline-none"
              placeholder="Search Club Name"
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

        </div>

        {isLoading ? (
          <APILoadingScreen />
        ) :
          <div className='grid grid-cols-3 grid-flow-row pt-32 '>
            {(
              ClubData.filter((data) => {
                if (searchTerm === '') {
                  return data
                } else if (
                  data.name?.toLowerCase().includes(searchTerm?.toLowerCase())
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
    </div>
  )
}
