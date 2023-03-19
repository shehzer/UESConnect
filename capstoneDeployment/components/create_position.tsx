import React, { FC, useState } from 'react'
import styles from '../styles/create_position.module.css'
import { Button, Text, Textarea } from '@nextui-org/react'
import { createPosition } from '../services/positions-service'

export type CreatePositionProps = {
  club_id: string
  toggleCreateBool: () => void
}

export const CreatePositionPage: FC<CreatePositionProps> = ({
  club_id,
  toggleCreateBool,
}) => {
  const [clubId, setClubId] = useState<string>(club_id)
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [numOpenings, setNumOpenings] = useState<number>(1)
  const [questions, setQuestions] = useState<Array<string>>([''])
  const [skills, setSkills] = useState<Array<string>>([''])

  function addQuestion() {
    questions.push('')
    setQuestions([...questions])
  }

  function addSkill() {
    skills.push('')
    setSkills([...skills])
  }

  function handleSubmit() {
    const newPos = {
      _id: '',
      clubId,
      name,
      description,
      numberOfOpenings: numOpenings,
      q: questions,
      skills,
    }
    createPosition(newPos).then(() => {
      toggleCreateBool()
    })
  }

  const questionList = questions.map((question, i) => {
    return (
      <div className={styles.questionContainer} id={'question' + (i + 1)}>
        <Text className={styles.inputLabel}>{'Question ' + (i + 1)}</Text>
        <input
          type={'text'}
          className={styles.question}
          onChange={({ target }) => {
            questions[i] = (target as HTMLInputElement).value
            setQuestions([...questions])
          }}
        />
      </div>
    )
  })

  const skillList = skills.map((skill, i) => {
    return (
      <div className={styles.skillContainer} id={'question' + (i + 1)}>
        <Text className={styles.inputLabel}>{'Question ' + (i + 1)}</Text>
        <input
          type={'text'}
          className={styles.skill}
          onChange={({ target }) => {
            skills[i] = (target as HTMLInputElement).value
            setSkills([...skills])
          }}
        />
      </div>
    )
  })
  return (
    <div className={styles.body}>
      <h1 className={styles.header}>Create New Position Posting</h1>
      <form className={styles.positionContainer}>
        <Text className={styles.inputLabel}>Position Title:</Text>
        <input
          type={'text'}
          key={'title'}
          className={styles.title}
          onChange={({ target }) => setName((target as HTMLInputElement).value)}
        />
        <Text className={styles.inputLabel}>Position Description:</Text>
        <Textarea
          key={'description'}
          className={styles.description}
          onChange={({ target }) =>
            setDescription((target as HTMLInputElement).value)
          }
        />
        <Text className={styles.inputLabel}>Openings Available:</Text>
        <input
          type={'text'}
          pattern={'[0-9]*'}
          key={'openings'}
          className={styles.openings}
          onChange={({ target }) =>
            setNumOpenings(parseInt((target as HTMLInputElement).value))
          }
        />
        <Text className={styles.subsectionHeader} key={'questionsHeader'}>
          Questions:
        </Text>

        {questionList}

        <Button
          className={styles.addQuestion}
          size={'sm'}
          onPress={() => addQuestion()}
        >
          Add Question
        </Button>

        <Text className={styles.subsectionHeader} key={'questionsHeader'}>
          Skills:
        </Text>

        {skillList}

        <Button
          className={styles.addSkill}
          size={'sm'}
          onPress={() => addSkill()}
        >
          Add Skill
        </Button>
        <Button
          className={styles.cancelButton}
          size={'sm'}
          onPress={() => toggleCreateBool()}
        >
          Cancel
        </Button>
        <Button
          className={styles.submitButton}
          size={'sm'}
          onPress={() => handleSubmit()}
        >
          Submit
        </Button>
      </form>
    </div>
  )
}
