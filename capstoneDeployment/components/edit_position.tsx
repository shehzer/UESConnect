import React, { FC, useCallback, useEffect, useState } from 'react'
import styles from '../styles/create_position.module.css'
import { Button, Text, Textarea } from '@nextui-org/react'
import { getPosition, updatePosition } from '../services/positions-service'

export type CreatePositionProps = {
  position_id: string
  setEditBool: (value: boolean) => void
}

export const EditPositionPage: FC<CreatePositionProps> = ({
  position_id,
  setEditBool,
}) => {
  const [clubId, setClubId] = useState<string>('')
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
      _id: position_id,
      clubId,
      name,
      description,
      numberOfOpenings: numOpenings,
      q: questions,
      skills,
    }
    updatePosition(position_id, newPos).then(() => {
      setEditBool(false)
    })
  }

  const fetchPosition = useCallback(async () => {
    const posInfo = await getPosition({ position_id })
    setName(posInfo.name)
    setClubId(posInfo.clubId)
    setDescription(posInfo.description)
    setNumOpenings(posInfo.numberOfOpenings)
    if (posInfo.q[0] !== null) {
      setQuestions(
        posInfo.q.map((question) => {
          return question.question
        }),
      )
    }
    if (posInfo.skills[0] !== null) {
      setSkills(
        posInfo.skills.map((skill) => {
          return skill.skill
        }),
      )
    }
  }, [position_id])

  useEffect(() => {
    void fetchPosition()
  }, [fetchPosition])

  const questionList = questions.map((question, i) => {
    return (
      <div className={styles.questionContainer} id={'question' + (i + 1)}>
        <Text className={styles.inputLabel}>{'Question ' + (i + 1)}</Text>
        <input
          type={'text'}
          className={styles.question}
          value={question}
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
          value={skill}
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
      <h1 className={styles.header}>Edit Position Posting: {position_id}</h1>
      <form className={styles.positionContainer}>
        <Text className={styles.inputLabel}>Position Title:</Text>
        <input
          type={'text'}
          key={'title'}
          value={name}
          className={styles.title}
          onChange={({ target }) => setName((target as HTMLInputElement).value)}
        />
        <Text className={styles.inputLabel}>Position Description:</Text>
        <Textarea
          key={'description'}
          value={description}
          className={styles.description}
          onChange={({ target }) =>
            setDescription((target as HTMLInputElement).value)
          }
        />
        <Text className={styles.inputLabel}>Openings Available:</Text>
        <input
          type={'text'}
          pattern={'[0-9]*'}
          value={numOpenings}
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
          onPress={() => setEditBool(false)}
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
