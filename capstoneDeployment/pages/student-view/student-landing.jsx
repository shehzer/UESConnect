import StudentCard from './student-card'
import React, { useState, useEffect } from 'react'
import APILoadingScreen from './loading-screen'
import { gql } from '@apollo/client'
import client from '../../components/apollo-client'
import StudentHeader from './student-header'

export default function studentLanding(props) {
  const [ClubData, setClubData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
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
    <div className="flex flex-col bg-white w-full h-full items-center relative">
      <div className='w-4/5 h-full'>
        <div className="ml-3 flex flex-col fixed bg-white w-full ">
          <StudentHeader></StudentHeader>
          <div className='py-2'>
            <input
              className="form-control
          py-1.5
          text-xl
          text-center
          text-slate-700
          bg-white bg-clip-padding
          border border-solid border-slate-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-slate-700 focus:bg-white focus:border-slate-800 focus:outline-none"
              placeholder="Search Club Name"
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </div>
        <div className='w-full px-8 flex flex-wrap -m-2 pt-36 '>
          {isLoading ? (
            <APILoadingScreen />
          ) : (
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
      </div>

    </div>
  )
}
