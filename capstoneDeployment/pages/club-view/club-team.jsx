import styles from 'styles/club-team.module.css'
import Head from 'next/head'
import { useTheme } from '@nextui-org/react'
import { css, Button } from '@nextui-org/react'
import { useState, useRef, useEffect } from 'react'
import { Input, Spacer, Text, Card, Grid } from '@nextui-org/react'
import { Router, useRouter } from 'next/router'
import { gql } from '@apollo/client'
import client from '../../components/apollo-client'
const jwt = require('jsonwebtoken')
const validator = require('validator');
const config = require('../../pages/api/config/default.json')
import Cookies from 'js-cookie'

import Table from './components/table'

export default function clubTeam(props) {

  const router = useRouter()


  useEffect(()=>{

      let token = Cookies.get('token')
    
        jwt.verify(token, config.jwtSecret, (err, decoded)=>{
        if(!decoded||err||decoded.role!="ADMIN"||Object.keys(props).length==0)
        {
          router.push({pathname:'/club-view/sign-in'})
    
        }

      }
      )

    
  },[])

  return (
    <div className={styles.container}>
      <h1 className="text-4xl" style={{ marginBottom: '50px' }}>
        Team Information
      </h1>

          <Table  clubID = {props.ID}></Table>

    </div>
  )
}
