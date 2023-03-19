import Link from 'next/link'
import styles from 'styles/club-landing.module.css'
import Head from 'next/head'
import { useTheme } from '@nextui-org/react'
import { css, Button } from '@nextui-org/react'
import { useState, useEffect, useRef, localStorage } from 'react'
import ClubInfo from './club-info'
import ClubApps from './club-apps'
import ClubTeams from './club-team'
// import { ClubPositions } from './club-positions'
import { ClubPositions } from "../../components/modal-positions";
import { ApplicationPage } from '../../components/club-applications'
import { Input, Spacer, Text } from '@nextui-org/react'
import { Router, useRouter } from 'next/router'


export async function getServerSideProps(context) {
  return {
    props: context.query, // will be passed to the page component as props
  }
}

export default function clubLanding(props) {
  const router = useRouter()
  const [infoVisible, setInfoVis] = useState(true)
  const [teamVisible, setTeamVis] = useState(false)
  const [positionVis, setPositionsVis] = useState(false)
  const [appVis, setAppVis] = useState(false)

  const [positionId, setPositionId] = useState('')
  const [positionName, setPositionName] = useState('')

  const [ID, setID] = useState(props.id)
  const [name, setName] = useState(props.name)
  const [department, setDep] = useState(props.department)
  const [description, setDes] = useState(props.description)
  const [team, setTeam] = useState(JSON.parse(props.execs))

  const updateInfo = (newInfo) => {
    setName(newInfo.name)
    setDep(newInfo.department)
    setDes(newInfo.description)

    router.push({
      pathname: 'club-landing',
      query: {
        id: props.id,
        name: newInfo.name,
        department: newInfo.department,
        description: newInfo.description,
        execs: JSON.stringify(team),
      },
    })
  }

  const updateTeam = (newTeam) => {
    setTeam([...newTeam])
    router.push({
      pathname: 'club-landing',
      query: {
        id: props.id,
        name: name,
        department: department,
        description: description,
        execs: JSON.stringify([...newTeam]),
      },
    })
  }



  function navigateApplications(position_id, position_name) {
    setPositionId(position_id)
    setPositionName(position_name)
    setPage('app')
  }

  function setPage(page) {
    switch (page) {
      case 'info':
        setInfoVis(true)
        setTeamVis(false)
        setPositionsVis(false)
        setAppVis(false)

        break
      case 'team':
        setInfoVis(false)
        setTeamVis(true)
        setPositionsVis(false)
        setAppVis(false)

        break
      case 'app':
        setInfoVis(false)
        setTeamVis(false)
        setPositionsVis(false)
        setAppVis(true)

        break
      case 'positions':
        setInfoVis(false)
        setTeamVis(false)
        setPositionsVis(true)
        setAppVis(false)

        break
      case 'about':
        setInfoVis(false)
        setTeamVis(false)
        setPositionsVis(false)
        setAppVis(false)

        break
      default:
    }
  }

  return (
    <div>
      <div className={styles.topBar}>
        <Text h6 size="$2xl">
          UES Connect
        </Text>
        <Button
          className="bg-[#0072F5]"
          style={{ position: 'absolute', top: 0, right: 10 }}
          size="xs"
        >
          Log Out
        </Button>
      </div>

      <div className={styles.navHolder}>
        <Button
          className="bg-[#0072F5]"
          onPress={() => {
            setPage('info')
          }}
        >
          Edit Club Information
        </Button>
        <Button
          className="bg-[#0072F5]"
          onPress={() => {
            setPage('team')
          }}
        >
          Edit Team Information
        </Button>
        <Button
          className="bg-[#0072F5]"
          onPress={() => {
            setPage('positions')
          }}
        >
          View Positions
        </Button>
      </div>

      <div id="pages">
        {infoVisible && (
          <ClubInfo
            update={updateInfo}
            ID={ID}
            name={name}
            description={description}
            department={department}
          ></ClubInfo>
        )}
        {positionVis && (
          <ClubPositions
            ID={ID}
            applicationNavigator={navigateApplications}
          ></ClubPositions>
        )}
        {teamVisible && (
          <ClubTeams update={updateTeam} ID={ID} team={team}></ClubTeams>
        )}
        {appVis && (
          <ApplicationPage
            position_id={positionId}
            position_name={positionName}
          ></ApplicationPage>
        )}
      </div>
    </div>
  )
}
