import { useRouter } from 'next/router'
import { gql, useMutation } from '@apollo/client'
import client from '../../../components/apollo-client'
import APILoadingScreen from '../loading-screen'
import StudentHeader from '../student-header'
import { useState, useRef, useEffect, localStorage } from 'react'
import validator from "validator";
import { FiShare } from 'react-icons/fi';
var sanitizer = require('sanitize')();

export default function StudentPositions(props) {
  const [positionData, setPositionData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isReadMore, setIsReadMore] = useState(true) //state to check if user has selected readmore
  const [userQA, setUserQA] = useState([{ question: '', answer: '' }])
  const [userEmail, setUserEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [isSharing, setIsSharing] = useState(false);

  const handleFormChange = (event, index) => {
    let data = [...userQA]
    data[index].answer = validator.unescape(event.target.value)
    setUserQA(data)
  }

  const share = () => {
    setIsSharing(true);
    if (navigator.share) {
      navigator
        .share({
          title: 'Application Link',
          text: 'Check out this application!',
          url: window.location.href,
        })
        .then(() => {
          setIsSharing(false);
        })
        .catch((error) => {
          console.error('Error sharing:', error);
          setIsSharing(false);
        });
    } else {
      setIsSharing(false);
      alert('Your browser does not support web sharing.');
    }
  };

  const handleEmailChange = (event) => {
    setUserEmail(validator.unescape(event.target.value))
  }

  const handleNameChange = (event) => {
    setUserName(event.target.value)
    console.log(event.target.value)
  }

  const submit = (e) => {
    e.preventDefault()
    if (!validator.isEmail(userEmail)) {
      alert('Please enter a valid email.');
    } else {
      applicationUpload({
        variables: {
          file: filename,
          applicationInput: {
            description: positionData.description,
            email: userEmail,
            name: userName,
            positionID: positionId,
            qA: userQA,
          },
        }
      })
      alert('Thank you for applying!')
      window.location.reload(false);
    }
  }

  const handleReadMore = () => {
    setIsReadMore(!isReadMore)
  }

  const [filename, setSelectedFile] = useState(null);

  const handleFileInputChange = (event) => {
    setSelectedFile(event.target.files[0]);
    console.log(event.target.files[0])
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

  const submitApplication = gql`
      mutation Mutation($file: Upload, $applicationInput: ApplicationInput) {
        createApplication(file: $file, applicationInput: $applicationInput) {
          _id
        }
      }
    `
  const [applicationUpload] = useMutation(submitApplication, {
    onCompleted: (data) => console.log(data),
    onError: (err) => { console.log(err, "i am erroring on application upload") }
  });

  return (
    <div className="flex flex-col bg-white w-full h-full text-slate-800 items-center ">
      <div className='w-4/5 pt-3 flex justify-between'>
        <StudentHeader></StudentHeader>
        <button
          onClick={share}
          className="bg-gray-800 text-white px-4 py-2 rounded-md flex items-center disabled:opacity-50"
          disabled={isSharing}
        >
          <FiShare className="w-5 h-5 mr-2" />
          Share Application
        </button>
      </div>
      <div className="rounded overflow-hidden w-4/5 shadow-lg my-4 p-4 flex flex-col text-slate-800 text-sm bg-slate-200">
        <div className="flex flex-col">
          <div className="text-4xl font-bold self-center">
            {positionData.name}
          </div>
          <div className="italic text-base self-center">
            Positions Avilable: {positionData.numberOfOpenings}
          </div>
          <div className="flex self-center space-x-2 pb-2">

            <span className="text-slate-800 font-bold text-lg" >Skills:</span>
            {positionData.skills != undefined
              ? positionData.skills.map((skill) =>
                skill !== null ? (
                  <div className="self-center flex flex-row text-slate-50">
                    <div className="bg-slate-500 text-base font-bold rounded-md px-2 self-center">
                      {skill.skill}
                    </div>
                  </div>
                ) : (
                  <span className="text-slate-800 font-bold text-lg" >None Specified</span>
                ),
              )
              : ''}
          </div>
        </div>
        <div className="py-3 flex flex-col selfs-center">
          <span className="text-slate-800 font-bold text-xl" >Role Description:</span>
          <div
            className={` text-md ${isReadMore && 'line-clamp-2'
              }`}
          >
            {' '}
            {/* Uses tailwind line-clamp to truncate the explanation until user clicks readmore */}
            {positionData.description}
          </div>
          <button
            onClick={handleReadMore}
            className=" hover:text-slate-500 bg-none rounded text-md font-bold text-left"
          >
            {isReadMore ? 'Read More...' : 'Read Less...'}
          </button>
        </div>
        <div className="flex flex-col">
          <label className="form-label inline-block text-lg font-bold">
            {' '}
            Full Name
          </label>
          <input
            type="text"
            className="
        form-control
        w-2/5
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
        focus:text-slate-700 focus:bg-white focus:border-slate-800 focus:outline-none
      "
            id="Name"
            placeholder="Gabor Simon"
            onChange={(event) => handleNameChange(event)}
          />
        </div>
        <div className="flex flex-col pt-2">
          <label className="form-label inline-block text-lg font-bold">
            Email
          </label>
          <input
            type="email"
            className="
        form-control
        w-2/5
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
        focus:text-slate-700 focus:bg-white focus:border-slate-800 focus:outline-none
      "
            id="Email"
            placeholder="gsimon@uwo.ca"
            onChange={(event) => handleEmailChange(event)}
          />
        </div>

        {isLoading ? (
          <APILoadingScreen></APILoadingScreen>
        ) : (
          <div className="flex flex-col">
            <form onSubmit={submit}>
              {userQA.map((form, index) => {
                return (
                  <div className="flex flex-col self-center" key={index}>
                    <div className="font-bold text-lg pt-2">
                      {form.question}
                    </div>
                    <textarea
                      className="form-control w-full px-3 py-1 text-base text-slate-600 bg-white bg-clip-padding border border-solid border-slate-300 rounded
                                        transition
                                        ease-in-out
                                        m-0
                                        focus:text-slate-800 focus:bg-white focus:border-slate-800 focus:outline-none self-center 
                                      "
                      id={form.question}
                      rows="3"
                      placeholder="Answer"
                      name="answer"
                      onChange={(event) => handleFormChange(event, index)}
                    ></textarea>
                  </div>
                )
              })}
            </form>
          </div>
        )}
        <div className="flex flex-col w-2/5 py-2">
          <label htmlFor="resume" className="font-bold text-gray-700 text-lg">
            Upload Your Resume
          </label>
          <input
            type="file"
            id="resume"
            name="resume"
            accept=".doc,.pdf,image/*"
            className="py-2 px-4 border border-gray-400 rounded-lg shadow-md text-gray-700 font-medium bg-white cursor-pointer"
            onChange={handleFileInputChange}
          />
        </div>
        <button
          className="slef-center bg-slate-600 hover:bg-slate-300 hover:text-slate-800 text-slate-50 rounded-md px-5 py-2 my-2 text-2xl font-bold"
          onClick={submit}
        >
          Submit
        </button>
      </div>
    </div>

  )
}
