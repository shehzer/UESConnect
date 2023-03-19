import { useRouter } from 'next/router'
import { gql } from '@apollo/client'
import client from '../../../components/apollo-client'
import APILoadingScreen from '../loading-screen'
import StudentHeader from '../student-header'
import { useState, useRef, useEffect, localStorage } from 'react'

export default function StudentPositions(props) {
  const [positionData, setPositionData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isReadMore, setIsReadMore] = useState(true) //state to check if user has selected readmore
  const [userQA, setUserQA] = useState([{ question: '', answer: '' }])
  const [userEmail, setUserEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [applicationId, setApplicationId] = useState('')

  const handleFormChange = (event, index) => {
    let data = [...userQA]
    data[index].answer = event.target.value
    setUserQA(data)
  }

  const handleEmailChange = (event) => {
    setUserEmail(event.target.value)
  }

  const handleNameChange = (event) => {
    setUserName(event.target.value)
    console.log(event.target.value)
  }

  const submit = (e) => {
    e.preventDefault()
    console.log(userEmail)
    console.log(userName)
    console.log(userQA)
    submitApplicationFunc()
  }

  const handleReadMore = () => {
    //sets isLiked to the opposite of the current isReadMore
    setIsReadMore(!isReadMore)
  }

  const [filename, setSelectedFile] = useState(null);

  const handleFileInputChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const router = useRouter()
  const positionId = router.query.positionId

  useEffect(() => {
    if (router.isReady) {
      fetchPosition()
    }
  }, [router.isReady])

  const addFields = (array) => {
    if (array) {
      const newArray = array.map((word) => ({
        question: word.question,
      }))
      setUserQA(newArray)
    }
  }

  const fetchPosition = async function () {
    const getPosition = gql`
      query Query($id: ID!) {
        position(ID: $id) {
          _id
          clubId
          description
          name
          numberOfOpenings
          q {
            question
          }
          skills {
            skill
          }
        }
      }
    `
    client
      .query({
        query: getPosition,
        variables: { id: positionId },
      })
      .then((result) => {
        console.log(result.data.position)
        setPositionData(result.data.position)
        setIsLoading(false)
        addFields(result.data.position.q)
      })
      .catch((e) => {
        alert(e.message)
      })
  }


  const handleFormSubmit = async function () {
    const submitApplication = gql`
    mutation ObjectUploader($filename: Upload!, $objType: String, $objId: String) {
      objectUploader(filename: $filename, objType: $objType, objId: $objId)
    }
    `
    client
      .mutate({
        mutation: submitApplication,
        variables: {
          filename: filename,
          objType: "resume",
          objId: '639036756318e7127b127811'
        },
      })
      .then((result) => {
        console.log(result)
        console.log('poo')
      })
      .catch((e) => {
        alert(e.message)
      })
  }

  const submitApplicationFunc = async function () {
    const submitApplication = gql`
      mutation Mutation($applicationInput: ApplicationInput) {
        createApplication(applicationInput: $applicationInput) {
          _id
        }
      }
    `
    client
      .mutate({
        mutation: submitApplication,
        variables: {
          applicationInput: {
            description: positionData.description,
            email: userEmail,
            name: userName,
            positionID: positionId,
            qA: userQA,
          },
        },
      })
      .then((result) => {
        console.log(result)
        setApplicationId(result)
        alert('Thank you for Applying!')
      })
      .catch((e) => {
        alert(e.message)
      })
  }

  return (
    <div className="flex flex-col bg-slate-200 w-full h-full text-slate-800 items-center ">
      <StudentHeader></StudentHeader>
      <div className="rounded overflow-hidden w-4/5 shadow-lg my-4 p-4 flex flex-col text-slate-800 text-sm bg-slate-50">
        <div className="flex flex-col space-y-1">
          <div className="text-4xl font-bold self-center">
            {positionData.name}
          </div>
          <div className="italic text-base self-center">
            Positions Avilable: {positionData.numberOfOpenings}
          </div>
          <div className="flex self-center space-x-2 pb-2">
            {positionData.skills != undefined
              ? positionData.skills.map((skill) =>
                skill !== null ? (
                  <div className="self-center flex flex-row text-slate-50">
                    <div className="bg-slate-500 text-base font-bold rounded-md px-2 self-center">
                      {skill.skill}
                    </div>
                  </div>
                ) : (
                  ''
                ),
              )
              : ''}
          </div>
        </div>
        <div className="px-2 mb-3 flex flex-col self-center">
          <div
            className={` text-sm text-center self-center ${isReadMore && 'line-clamp-2'
              }`}
          >
            {' '}
            {/* Uses tailwind line-clamp to truncate the explanation until user clicks readmore */}
            {positionData.description}
          </div>
          <button
            onClick={handleReadMore}
            className=" hover:text-slate-500 bg-none rounded text-sm font-bold self-center"
          >
            {isReadMore ? 'Read More...' : 'Read Less...'}
          </button>
        </div>
        <form onSubmit={handleFormSubmit}>
          <div className="flex flex-col items-center justify-center">
            <label htmlFor="resume" className="mb-2 font-bold text-gray-700">
              Upload Your Resume
            </label>
            <input
              type="file"
              id="resume"
              name="resume"
              className="py-2 px-4 border border-gray-400 rounded-lg shadow-md text-gray-700 font-medium"
              onChange={handleFileInputChange}
            />
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="py-2 px-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
              disabled={!filename}
            >
              Upload
            </button>
          </div>
        </form>
        <div className="flex self-center space-x-2">
          <div className="flex flex-col self-center">
            <label className="form-label inline-block mb-2 text-lg font-bold self-center">
              {' '}
              Full Name
            </label>
            <input
              type="name"
              className="
        form-control
        w-full
        px-3
        py-1.5
        text-base
        text-slate-700
        bg-white bg-clip-padding
        border border-solid border-slate-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-slate-700 focus:bg-white focus:border-blue-600 focus:outline-none
      "
              id="Name"
              placeholder="Gabor Simon"
              onChange={(event) => handleNameChange(event)}
            />
          </div>
          <div className="flex flex-col self-center">
            <label className="form-label inline-block mb-2 text-lg font-bold self-center">
              Email
            </label>
            <input
              type="email"
              className="
        form-control
        w-full
        px-3
        py-1.5
        text-base
        text-slate-700
        bg-white bg-clip-padding
        border border-solid border-slate-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-slate-700 focus:bg-white focus:border-blue-600 focus:outline-none
      "
              id="Email"
              placeholder="gsimon@uwo.ca"
              onChange={(event) => handleEmailChange(event)}
            />
          </div>
        </div>
        <div className="flex flex-col">
          {isLoading ? (
            <APILoadingScreen></APILoadingScreen>
          ) : (
            <form onSubmit={submit}>
              {userQA.map((form, index) => {
                return (
                  <div className="flex flex-col self-center" key={index}>
                    <div className="font-bold text-lg self-center pb-3 pt-4">
                      {form.question}
                    </div>
                    <textarea
                      className="form-control w-full px-3 py-1.5 text-base text-slate-600 bg-white bg-clip-padding border border-solid border-slate-300 rounded
                                        transition
                                        ease-in-out
                                        m-0
                                        focus:text-slate-800 focus:bg-white focus:border-slate-800 focus:outline-none self-center 
                                      "
                      id={form.question}
                      rows="3"
                      placeholder="Answer for Question"
                      name="answer"
                      onChange={(event) => handleFormChange(event, index)}
                    ></textarea>
                  </div>
                )
              })}
            </form>
          )}
          <button
            className="slef-center bg-slate-600 hover:bg-slate-300 hover:text-slate-800 text-slate-50 rounded-md px-5 py-2 my-2 text-2xl font-bold"
            onClick={submit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}
