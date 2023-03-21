import React, { FC } from 'react'
import styles from '../styles/application.module.css'
import { applicationResponse, field } from '../public/interfaces/position.interface'
import {Text, Modal } from '@nextui-org/react'

export type ApplicationProps = {
  application: applicationResponse
}

export const ApplicationPage: FC<ApplicationProps> = ({ application }) => {
  // handles conditional for different input types during render
  const questionList = application.qA.map((q, i) => {
    return (
      <div className={styles.questionSection}>
        <Text b key={q.question + 'i'} className={styles.question}>
          {q.question}
        </Text>
        <Text>
          {q.answer}
        </Text>
      </div>
    )
  })
  return (
    <Modal>
      <div className={styles.body}>
        <Text b size={25} className={styles.header}>Application {application._id}</Text>
        <form>{questionList}</form>
      </div>
    </Modal>
  )
}
