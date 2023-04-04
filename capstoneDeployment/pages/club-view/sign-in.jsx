import Link from 'next/link'
import styles from 'styles/index.module.css'
import Head from 'next/head'
import { useTheme } from '@nextui-org/react'
import { CSS, Button, Loading, Input } from '@nextui-org/react'
import { useState, useRef, useEffect, localStorage, useContext } from 'react'
import { Router, useRouter } from 'next/router'
import { gql, useMutation } from '@apollo/client'
import client from '../../components/apollo-client'
import { logMissingFieldErrors } from '@apollo/client/core/ObservableQuery'
const jwt = require('jsonwebtoken')
const config = require('../../pages/api/config/default.json')
import Cookies from 'js-cookie'


export default function signIn(props) {
  const router = useRouter()

  const [username, setUser] = useState('')
  const [password, setPass] = useState('')
  const [load, setLoad] = useState(false)

  const handleKeyDown = function(event){
    if(event.key === 'Enter') {
      logIn()
    }
  }


  const mutationQ = gql`
  mutation Mutation($loginInput: LoginInput) {
    loginUser(loginInput: $loginInput) {
      _id
      token
      userRole
    }
  }
  
  `
const queryQ = gql`query Query($id: ID!) {
    club(ID: $id) {
      execs {
        _id
        headshotURL
        name
        program
        role
        year
      }
      logoURL
      
    }
  }`

  const logIn = async function () {

    sanitize(username)

    client
      .mutate({
        mutation: mutationQ,
        variables: {
          loginInput: {
            email: username,
            password: password
          },
        },
      })
      .then((data) => {

        setLoad(false)
        
        let role = data.data.loginUser.userRole
        let token = data.data.loginUser.token
        let ID = data.data.loginUser._id
        Cookies.set('token', token)


        if(role!="MASTER")
        {
            router.push({
              pathname: 'club-landing',
              query: {
                clubID: ID
              },
            })
        }
        else
        {
          router.push({
            pathname: '../admin-view/admin-landing',

          })
          
        }

      })
      .catch((e) => {
        setLoad(false)
        alert(e.message)
      })

   

    
  }

  return (
    <div
      className={styles.body}
      style={{
        background: 'linear-gradient(112deg, #7EE8FA -50%, #EEC0C6 50%)',
      }}
    >
      <Head>
        <title>Welcome to UES Connect</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-5xl mt-16 text-blue-500 ">Club Sign In</h1>

      <div
        style={{ display: 'flex', flexDirection: 'column', marginTop: '50px' }}
      >
        <Input
          className=" bg-black mb-8"
          color="primary"
          size="xl"
          bordered
          label="Email Address"
          value={username}
          onChange={(e)=>{setUser(e.target.value)}}
        />
        <Input.Password
          onKeyDown={handleKeyDown}
          className="bg-black mb-8"
          size="xl"
          color="primary"
          bordered
          label="Password"
          onChange={(e)=>{setPass(e.target.value)}}
          value={password}
        />

        <Button  className='bg-blue-600' onPress={()=>{setLoad(true);logIn()}}>
          {load && <Loading type="spinner" color="currentColor" size="md" />}
            {!load && 'Log In'}
        </Button>
      </div>

    </div>
  )
}
