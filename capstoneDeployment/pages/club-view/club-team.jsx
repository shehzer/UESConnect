import styles from 'styles/club-team.module.css'
import Head from 'next/head'
import { useTheme } from '@nextui-org/react'
import { css, Button } from '@nextui-org/react'
import { useState, useRef, useEffect } from 'react'
import { Input, Spacer, Text, Card, Grid } from '@nextui-org/react'
import { Router, useRouter } from 'next/router'
import { gql } from '@apollo/client'
import client from '../../components/apollo-client'

import Table from './components/table'

export default function clubTeam(props) {


  function save(newTeam) {

    let sendTeam = newTeam.map((item)=>({...item}))
    sendTeam.forEach((item, index)=>{ delete item.__typename; delete item.headshotURL})

    console.log("sendteam", sendTeam)

    const mutationQ = gql`
      mutation Mutation($id: ID!, $clubInput: ClubInput) {
        editClub(ID: $id, clubInput: $clubInput)
      }
    `
    client
      .mutate({
        mutation: mutationQ,
        variables: { id: props.ID, clubInput: { execs: sendTeam } },
      })
      .then((result) => {
        console.log(result)

        props.update(newTeam)
      })
      .catch((e) => {
        alert(e.message)
      })
  }

  return (
    <div className={styles.container}>
      <h1 className="text-4xl" style={{ marginBottom: '50px' }}>
        Team Information
      </h1>

          <Table execs={props.team} save={save}></Table>

    </div>
  )
}
