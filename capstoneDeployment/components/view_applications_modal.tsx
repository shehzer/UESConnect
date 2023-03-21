import React, { FC, useCallback, useEffect, useState } from 'react'
import styles from '../styles/application.module.css'
import { getApplications } from '../services/applications-service'
import { Text, Modal } from '@nextui-org/react'
import { application, field } from '../public/interfaces/position.interface'
import { getPositions } from '../services/positions-service'

export type ApplicationModalProps = {
  position_id: string;
  position_name: string;
  onDismiss: () => void;
  show: boolean;
}

type applicationResponse = {
  name: string
  email: string
  description: string
  qA: [{ answer: string; question: string }]
}

export const ApplicationsModalBody: FC<ApplicationModalProps> = ({
                                                        position_id,
                                                        position_name,
                                                        show,
                                                        onDismiss
                                                      }) => {
  const [positionName, setPositionName] = useState(position_name)
  const [applicationsArr, setApplicationsArr] = useState<
    Array<applicationResponse>
    >([])

  const applicationList = applicationsArr.map((application, i) => {
    const questionList = application.qA.map((question, i) => {
      return (
        <div className={styles.qaContainer}>
          <Text className={styles.label}>Question:</Text>
          <Text className={styles.question}>{question.question}</Text>
          <Text className={styles.label}>Answer:</Text>
          <Text className={styles.ans}>{question.answer}</Text>
        </div>
      )
    })
    return (
      <div className={styles.applicationContainer}>
        <Text className={styles.label}>Name:</Text>
        <Text className={styles.output}>{application.name}</Text>
        <Text className={styles.label}>Email:</Text>
        <Text className={styles.output}>{application.email}</Text>
        <Text className={styles.label}>Description:</Text>
        <Text className={styles.output}>{application.description}</Text>
        <Text className={styles.subHeader}>Question Answers:</Text>
        <div>{questionList}</div>
      </div>
    )
  })

  const fetchApplications = useCallback(async () => {
    setApplicationsArr(await getApplications(position_id))
    console.log(applicationsArr)
  }, [position_id])

  useEffect(() => {
    void fetchApplications()
  }, [fetchApplications])

  return (
    <Modal closeButton aria-labelledby={'View Applications Modal'} open={show} onClose={onDismiss}>
      <div className={styles.body}>
        <h1 className={styles.header}>
          Applications for position: {positionName}
        </h1>
        <div className={styles.contentContainer}>{applicationList}</div>
      </div>
    </Modal>
  )
}