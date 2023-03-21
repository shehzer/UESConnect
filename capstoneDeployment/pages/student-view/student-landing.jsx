import StudentCard from './student-card'
import React, { useState, useEffect } from 'react'
import APILoadingScreen from './loading-screen'
import { gql } from '@apollo/client'
import client from '../../components/apollo-client'
import StudentHeader from './student-header'
import Link from 'next/link'
import { GrUserAdmin } from 'react-icons/gr'
import {BiSearch} from 'react-icons/bi'


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
      <footer className="bg-white w-full absolute bottom-0 left-0 h-12 flex justify-center text-slate-700 text-md">
        <div className="flex items-center font-bold w-4/5 ml-2">
          <p className="mr-1 font-bold">Built by:</p>
          <Link href="" className='mr-1 hover:text-slate-500'>
            Cole Bagshaw,
          </Link>
          <Link href=" " className='mr-1 hover:text-slate-500'>
            David Esposto,
          </Link>
          <Link href="" className='mr-1 hover:text-slate-500'>
            Gabor Simon,
          </Link>
          <Link href="" className='mr-1 hover:text-slate-500'>
            Jasdeep Singh,
          </Link>
          <Link href="" className='mr-1 hover:text-slate-500'>
            Shehzer Naumani
          </Link>
        </div>
      </footer>
    </div>
  )
}
