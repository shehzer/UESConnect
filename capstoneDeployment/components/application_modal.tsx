import React, { FC } from 'react'
import styles from '../styles/application.module.css'
import {Text, Modal} from '@nextui-org/react'
import {applicationResponse} from "../public/interfaces/position.interface";


export type ApplicationProps = {
  application: applicationResponse;
  onDismiss: () => void;
  show: boolean;
}

export const ApplicationModalBody: FC<ApplicationProps> = ({ application, onDismiss, show }) => {

  const questionList = application.qA.map((q, i) => {
    return (
      <div className={styles.questionSection} key={'question' + i}>
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
    <Modal width={'40%'} closeButton open={show} onClose={onDismiss}>
      <div className={styles.container}>
        <div className={styles.title}>
          <Text b size={23} className={styles.header}>Application {application._id}</Text>
        </div>
        <div className={styles.body}>
          <div className={styles.fieldBlock}>
            <Text b size={22}>Applicant Name:</Text>
            <Text size={18}>{application.name}</Text>
          </div>
          <div className={styles.fieldBlock}>
            <Text b size={20}>Applicant Email:</Text>
            <Text size={18}> {application.email}</Text>
          </div>
          <form>{questionList}</form>
        </div>
      </div>
    </Modal>
  )
}