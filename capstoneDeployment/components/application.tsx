import React, { FC } from 'react'
import styles from '../styles/application.module.css'
import { application, field } from '../public/interfaces/position.interface'

export type ApplicationProps = {
  application: application
}

export const ApplicationPage: FC<ApplicationProps> = ({ application }) => {
  // handles conditional for different input types during render
  function renderInput(
    questionId: field['id'],
    answerType: field['answerType'],
  ) {
    if (answerType === 'textarea') {
      return <textarea key={questionId + 't'} className={styles.answer} />
    } else
      return (
        <input
          type={answerType}
          key={questionId + 't'}
          className={styles.answer}
        />
      )
  }
  const questionList = application.fields.map((field) => {
    return (
      <div className={styles.questionSection}>
        <label key={field.id + 'q'} className={styles.question}>
          {field.question}
        </label>

        {renderInput(field.id, field.answerType)}
      </div>
    )
  })
  return (
    <div className={styles.body}>
      <h1 className={styles.header}>Application {application.id}</h1>
      <form>{questionList}</form>
    </div>
  )
}
