import React, { FC, useState, useEffect, useCallback } from 'react'
import { position } from '../public/interfaces/position.interface'
import {
  getPositions,
  deletePosition,
  getPosition,
} from '../services/positions-service'
import styles from '../../styles/club-positions.module.css'
import { Button, Text } from '@nextui-org/react'
import { CreatePositionPage } from './create_position'
import { EditPositionPage } from './edit_position'
import Link from 'next/link'

export type PositionProps = {
  ID: string
  applicationNavigator: (position_id: string, positionName: string) => void
}

export const ClubPositions: FC<PositionProps> = ({
  ID,
  applicationNavigator,
}) => {
  const [positionsArr, setPositionsArr] = useState<position[]>([])
  const [clubId, setClubId] = useState(ID)
  const [selectedPos, setSelectedPos] = useState('')
  const [createBool, setCreateBool] = useState(false)
  const [editBool, setEditBool] = useState(false)

  console.log(clubId)

  // useEffect(()=>{

  // },[])

  function handleEdit(positionId: string) {
    // navigates to edit window
    setSelectedPos(positionId)
    setEdit(true)
  }

  function handleDelete(positionId: string) {
    // deletes the selected application

    // setPositionsArr(positionsArr.filter((item)=>{
    //   if(item._id!=positionId)
    //   {
    //     return item;
    //   }
    // }))
    deletePosition(positionId).then(() => {
      void fetchPositions()
    })

    window.location.reload()
  }

  function setEdit(value: boolean) {
    setEditBool(value)
    // if(editBool){
    //    window.location.reload()
    // }
  }

  function toggleCreate() {
    setCreateBool(!createBool)
  }

  const fetchPositions = useCallback(async () => {
    setPositionsArr(await getPositions({ clubId }))
    console.log(positionsArr)
  }, [clubId])

  useEffect(() => {
    void fetchPositions()
  }, [fetchPositions, editBool])

  const positionsElement = positionsArr.map((position, i) => {
    return (
      <div
        className={styles.elementContainer}
        id={position._id + 'elementContainer'}
      >
        <Text className={styles.title} id={position._id + position.name}>
          {position.name}
        </Text>
        <Text
          className={styles.description}
          id={position._id + position.description}
        >
          {position.description}
        </Text>
        <div
          className={styles.buttonContainer}
          id={position._id + 'button_container'}
        >
          <Button
            className={styles.editButton}
            size={'sm'}
            onPress={() => handleEdit(position._id)}
          >
            Edit
          </Button>
          <Button
            className={styles.navButton}
            size={'sm'}
            onPress={() => applicationNavigator(position._id, position.name)}
          >
            View Applications
          </Button>
          <Button
            className={styles.deleteButton}
            size={'sm'}
            onPress={() => handleDelete(position._id)}
          >
            Delete
          </Button>
        </div>
      </div>
    )
  })
  return (
    <div className={styles.overallContainer}>
      <h1 className={styles.pageTitle} id={styles.pageTitle}>
        Position postings
      </h1>
      {positionsElement}
      {createBool ? (
        <CreatePositionPage club_id={clubId} toggleCreateBool={toggleCreate} />
      ) : (
        <Button
          className={styles.createButton}
          id={styles.createButton}
          size={'sm'}
          onPress={() => toggleCreate()}
        >
          Create
        </Button>
      )}
      {editBool ? (
        <EditPositionPage position_id={selectedPos} setEditBool={setEdit} />
      ) : null}
    </div>
  )
}
