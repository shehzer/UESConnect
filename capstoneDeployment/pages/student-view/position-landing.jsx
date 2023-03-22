import StudentCard from './student-card'
import React, { useState, useEffect } from 'react'
import APILoadingScreen from './loading-screen'
import { gql } from '@apollo/client'
import client from '../../components/apollo-client'
import StudentHeader from './student-header'
import Link from 'next/link'
import StudentFooter from './student-footer'
import { RiAdminLine, RiInformationLine } from 'react-icons/ri'
import { FaHeart } from 'react-icons/fa'
import HelpPopUp from './help-popup'
import PositionCard from './position-card'

export default function positionLanding(props) {
  // const [ClubData, setClubData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showGreeting, setShowGreeting] = useState(false) // state for showing greeting popup
  const [viewOnlyLiked, setViewOnlyLiked] = useState(false)
  // console.log(viewOnlyLiked, 'bitch hoe')

  const [clubPositions, setClubPositions] = useState([])

  useEffect(() => {
    fetchClubPositions()
    setIsLoading(false)
  }, [])

  function viewLiked() {
    setViewOnlyLiked(!viewOnlyLiked)
  }

  function openInfo() {
    setShowGreeting(true)
  }

  function fetchClubs() {
    const getClubs = gql`
      query GetClubs {
        getClubs {
          _id
          department
          description
          logoURL
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
    return client
      .query({
        query: getClubs,
      })
      .then((result) => {
        return result.data.getClubs
      })
      .catch((e) => {
        alert(e.message)
      })
  }

  const fetchPositions = async function (clubId) {
    const getPositions = gql`
      query GetPositions($clubId: String) {
        getPositions(clubId: $clubId) {
          _id
          clubId
          description
          name
          numberOfOpenings
          skills {
            skill
          }
        }
      }
    `
    return client
      .query({
        query: getPositions,
        variables: { clubId: clubId },
      })
      .then((result) => {
        return result.data.getPositions
      })
      .catch((e) => {
        alert(e.message)
      })
  }

  const hrefClub = '/student-view/student-landing'

  async function fetchClubPositions() {
    const clubPositions = [];

    // Fetch all clubs
    const clubs = await fetchClubs();

    // For each club, fetch its associated positions
    for (const club of clubs) {
      const positions = await fetchPositions(club._id);

      // Add each position to the clubPositions array
      for (const position of positions) {
        clubPositions.push({
          _id: position._id,
          clubId: position.clubId,
          description: position.description,
          name: position.name,
          numberOfOpenings: position.numberOfOpenings,
          skills: position.skills,
          clubName: club.name,// Add the club name to the position object
          clubLogo: club.logoURL
        });
      }
    }
    console.log(clubPositions)
    setClubPositions(clubPositions)
  }


  return (
    <div className="flex flex-col bg-gray-100 w-full h-full items-center relative">
      {/* Greeting popup */}
      <div className="w-full h-20 fixed bg-white"></div>
      <div className="flex fixed bg-white h-20 justify-between centent-center w-4/5">
        <div className='flex'>
          <StudentHeader page={'Positions'} href={'/student-view/student-landing'}></StudentHeader>
        </div>
        <div className="flex justify-center content-center">
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
          focus:text-slate-700 focus:bg-white focus:border-slate-800 focus:outline-none mr-2
          w-72"
            placeholder="&#x1F50E;&#xFE0E; Position / Club / Skill"
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <div className="group flex relative w-6 justify-items-center">
            <button
              onClick={viewLiked}
              className={` text-black text-xl rounded-full hover:text-red-200 hover:shadow-xl ${viewOnlyLiked && 'text-red-400'
                } bg-none`}
            >
              <FaHeart className="text-2xl"></FaHeart>
            </button>
            <span
              className="group-hover:opacity-100 transition-opacity bg-slate-500 text-sm text-gray-100 rounded-md absolute 
     opacity-0 w-16 text-center left-1/2 
    -translate-x-1/2 translate-y-14"
            >
              View Liked
            </span>
          </div>
          <div className="group flex relative w-6 justify-items-center ml-1">
            <button onClick={openInfo} className="hover:text-slate-500">
              <RiInformationLine
                className="text-2xl"
                color="black"
              ></RiInformationLine>
            </button>
            <span
              className="group-hover:opacity-100 transition-opacity bg-slate-500 text-sm text-gray-100 rounded-md absolute 
     opacity-0 w-16 text-center left-1/2 
    -translate-x-1/2 translate-y-14"
            >
              Site Info
            </span>
          </div>
          <div className="group flex relative w-6 ml-1 justify-items-center">
            <Link href="/club-view/sign-in" className="flex">
              <RiAdminLine className="text-2xl" color="black"></RiAdminLine>
            </Link>
            <span
              className="group-hover:opacity-100 transition-opacity bg-slate-500 text-sm text-gray-100 rounded-md absolute 
     opacity-0 w-20 text-center left-1/2 
    -translate-x-1/2 translate-y-14"
            >
              Club Admin
            </span>
          </div>
        </div>
      </div>
      {showGreeting && (
        <HelpPopUp page={'Positions'} setShowGreeting={setShowGreeting}></HelpPopUp>
      )}
      <div className="w-4/5 h-full">
        {isLoading && !showGreeting ? (
          <APILoadingScreen />
        ) : (
          <div className="grid grid-cols-2 grid-flow-row pt-20 pb-12 min-h-screen text-black ">
            {clubPositions.filter((data) => {
              if (!viewOnlyLiked) {
                return data
              } else if (localStorage.getItem(String(data.name + data._id)) === 'true') {
                return data
              }
            })
              .filter((position) => {
                const searchTermLowercase = searchTerm.toLowerCase();
                const positionNameLowercase = position.name.toLowerCase();
                const clubNameLowercase = position.clubName.toLowerCase();
                const skillsLowercase = position.skills?.map(skill => skill?.skill?.toLowerCase()).join(' ');

                return positionNameLowercase.includes(searchTermLowercase) ||
                  clubNameLowercase.includes(searchTermLowercase) ||
                  skillsLowercase.includes(searchTermLowercase);
              })
              .slice(0)
              .map((position, index) => (
                <PositionCard key={index} index={index} position={position} viewOnlyLiked={viewOnlyLiked}></PositionCard>
              ))}
          </div>
        )}
      </div>
      <StudentFooter ></StudentFooter>
    </div>
  )
}
