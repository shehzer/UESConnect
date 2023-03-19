import Link from 'next/link'
import styles from 'styles/club-info.module.css'
import Head from 'next/head'
import { useTheme } from '@nextui-org/react'
import { CSS, Button, Input, Text, Textarea, Loading } from '@nextui-org/react'
import { useState, useRef, useEffect, localStorage } from 'react'
import ImageProcess from './image-processing'
import useSWR from 'swr'
import { gql, useMutation } from '@apollo/client'
import client from '../../components/apollo-client'
import { Router, useRouter } from 'next/router'
import graphql from 'graphql'

export default function clubInfo(props) {
  const [clubName, setClubName] = useState(
    props.name == undefined ? 'Insert Club Name!' : props.name,
  )
  const [department, setDep] = useState(
    props.department == undefined ? 'Insert Department!' : props.department,
  )
  const [description, setDes] = useState(
    props.description == undefined ? 'Insert Description!' : props.description,
  )
  const [images, setImages] = useState([])
  const [load, setLoad] = useState(false)
  const router = useRouter()

  const UPLOAD_FILE = gql`
mutation UploadFile($file: Upload!) {
  uploadFile(file: $file)
}
`;

  const [fileUpload] = useMutation(UPLOAD_FILE, {
    onCompleted: (data) => console.log(data),
});
const handleFileChange = (e) => {
  const file = e.target.files;
  if (!file) return;
  fileUpload({ variables: { file } });
};
   
  
   

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
        console.log(result)
        setLoad(false)
        props.update({
          name: clubName,
          department: department,
          description: description,
        })

        
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

        <input
      type="file"
      name="GraphQLUploadForMedium"
      onChange={handleFileChange}
    />



        <div className={styles.imageBox}>
          <Text size="larger">Set Your Club Logo</Text>

          {/* <ImageProcess onChange={onChangeImage} images={images}></ImageProcess> */}
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
          <Button onPress={save} className="bg-green-400" size="md">
            {load && <Loading type="spinner" color="currentColor" size="md" />}
            {!load && 'Save'}
          </Button>
        </div>
      </div>
    </div>
  )
}
