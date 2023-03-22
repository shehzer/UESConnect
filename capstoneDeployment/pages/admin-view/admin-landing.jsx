import Link from 'next/link'
import Head from 'next/head'
import { useTheme } from '@nextui-org/react'
import { CSS, Button, Loading, Input, Text } from '@nextui-org/react'
import { useState, useRef, useEffect, localStorage } from 'react'
import { Router, useRouter } from 'next/router'
import { gql, useMutation } from '@apollo/client'
import client from '../../components/apollo-client'
import { logMissingFieldErrors } from '@apollo/client/core/ObservableQuery'
import styles from 'styles/admin.module.css'
import TableAdmin from './table-admin'
import Cookies from 'js-cookie'
const jwt = require('jsonwebtoken')
const config = require('../../pages/api/config/default.json')




export async function getServerSideProps(context) {
    return {
      props: context.query, // will be passed to the page component as props
    }
  }

export default function amdinLanding(props) {

  const [adminList, setList] = useState([...JSON.parse(props.admins)])
  const router = useRouter()


  useEffect(()=>{
    let token = Cookies.get('token')

    jwt.verify(token, config.jwtSecret, (err, decoded)=>{
      console.log(err, decoded)

      if(decoded.role!="MASTER")
      {
        router.push({
          pathname:'/club-view/sign-in',

        })

      }
    });

  },[])

  



  return (

    <div className={styles.header}>
      <div className={styles.topBar}>
        <Text h6 size="$2xl" weight="bold">
          Club Admins
        </Text>
        <Button
          className="bg-[#0072F5]"
          style={{ position: 'absolute', top: 0, right: 10 }}
          size="xs"
        >
          Log Out
        </Button>
      </div>

      <TableAdmin clubAdmins={props.admins} />





    </div>


  )
}
