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
    <div className="flex flex-col bg-slate-200 w-full min-h-screen text-slate-800 items-center">
      <div className="ml-3 flex flex-col items-center">
        <StudentHeader></StudentHeader>
        <input
          className="rounded text-center mb-2 mt-2 text-3xl"
          placeholder="Search Club Name"
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>
      <div className='w-full px-8 flex flex-wrap -m-2 pt-4'>
        {isLoading ? (
          <APILoadingScreen />
        ) : (
          ClubData.filter((data) => {
            if (searchTerm === '') {
              return data
            } else if (
              data.name.toLowerCase().includes(searchTerm.toLowerCase())
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
  )

}
