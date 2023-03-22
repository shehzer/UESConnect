import Link from 'next/link'
import styles from 'styles/club-info.module.css'
import Head from 'next/head'
import { useTheme } from '@nextui-org/react'
import { CSS, Button, Input, Text, Textarea, Loading,Image } from '@nextui-org/react'
import { useState, useRef, useEffect, localStorage } from 'react'
import ImageProcess from './image-processing'
import useSWR from 'swr'
import { gql, useMutation, useQuery } from '@apollo/client'
import client from '../../components/apollo-client'
import { Router, useRouter } from 'next/router'
import Cookies from 'js-cookie'
const jwt = require('jsonwebtoken')
import graphql from 'graphql'
const validator = require('validator');
const config = require('../../pages/api/config/default.json')


export default function clubInfo(props) {
  const [clubName, setClubName] = useState(
    props.name == undefined ? 'Insert Club Name!' : props.name,
  )
  const [department, setDep] = useState(
    props.department == undefined ? 'Insert Department!' : props.department,
  )
  const router = useRouter()
  const [description, setDes] = useState(
    props.description == undefined ? 'Insert Description!' : props.description,
  )
  const [load, setLoad] = useState(false)
  const[logo, setLogo] = useState('')



  const UPLOAD_FILE = gql`mutation UploadClubLogo($file: Upload, $clubId: String) {
    uploadClubLogo(file: $file, clubId: $clubId)
  }`;


  const [fileUpload] = useMutation(UPLOAD_FILE, {onCompleted: (data) => {
    
    console.log(data)
    setLogo(data.uploadClubLogo)

  }});
  const handleFileChange = (e) => 
  {
    const file = e.target.files;

    if (!file) return;
    fileUpload({ variables: { file:file[0], clubId:props.ID } });
  }; 


  const getClubExecs= gql`
  query Query($id: ID!) {
    club(ID: $id) {
      _id
      name
      department
      description
      logoURL
    }
  }`



const setItems = async()=>{

  let result = await getItems()
  setDep(result.data.club.department)
  setDes(result.data.club.description)
  setClubName(result.data.club.name)
  setLogo(result.data.club.logoURL)

}

const getItems = async()=>
{
  return client
  .query({
    query: getClubExecs,
    variables: {
      id: props.ID,
    },
 
  
  })
  .then((result) => {

    console.log(result)


    return result
   

  })
  .catch((e) => {
    alert(e.message)
  })

}

useEffect(()=>{


  let token = Cookies.get('token')

  jwt.verify(token, config.jwtSecret, (err, decoded)=>{
    if(!decoded||err||decoded.role!="ADMIN")
    {
      router.push({pathname:'/club-view/sign-in'})

    }
    else
    {
      setItems()
    }
  }
  )

  

},[])
   





const save = async function () {
  
  setLoad(true)

  const mutationQ = gql`
    mutation Mutation($id: ID!, $clubInput: ClubInput) {
      editClub(ID: $id, clubInput: $clubInput)
    }
  `

  client
    .mutate({
      mutation: mutationQ,
      variables: {
        id: props.ID,
        clubInput: {
          name: clubName,
          department: department,
          description: description,
        },
      },
    })
    .then((result) => {
   
      setLoad(false)
  
    })
    .catch((e) => {
      alert(e.message)
      setLoad(false)
    })

}

  return (
    <div className={styles.container}>
      <h1 className="text-4xl" style={{ marginBottom: '50px' }}>
        Club Information
      </h1>
      <div className={styles.body}>
        <div className={styles.infoBox}>
          <Input
            id="club-prompt"
            bordered
            width="40%"
            label="Set Your Club Name"
            status="default"
            size="xl"
            shadow={false}
            value={clubName}
            onChange={(e) => {
              setClubName(e.target.value)
            }}
          />
        </div>
        <div className={styles.infoBox}>
          <Input
            id="club-department"
            bordered
            width="40%"
            label="Set Your Engineering Department"
            status="default"
            size="xl"
            shadow={false}
            value={department}
            onChange={(e) => {
              setDep(e.target.value)
            }}
          />
        </div>

        <div className={styles.imageBox}>
          <Text size="larger">Set Your Club Logo</Text>

          <input type="file" name="GraphQLUploadForMedium" accept="image/*" onChange={handleFileChange} />


        </div>

        <div className={styles.imageBox}>

        <img src={logo} alt="logo" style={{width:100, height:100}} />

        </div>


        <div className={styles.infoBox}>
          <Textarea
            onChange={(e) => {
              setDes(e.target.value)
            }}
            id="club-description"
            bordered
            size="xl"
            width="40%"
            label="Club Description"
            value={description}
          />
        </div>
        <div className={styles.infoBox}>
          <Button onPress={save} className="bg-green-600" size="md">
            {load && <Loading type="spinner" color="currentColor" size="md" />}
            {!load && 'Save'}
          </Button>
        </div>
      </div>
    </div>
  )
}
