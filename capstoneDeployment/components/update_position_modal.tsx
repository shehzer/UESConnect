import React, {FC, useCallback, useEffect, useState} from "react";
import {Button, Modal, Text, Textarea} from "@nextui-org/react";
import styles from '../styles/create_position_modal.module.css'
import { position } from '../public/interfaces/position.interface'
import {getPosition} from "../services/positions-service";

type UpdateModalBodyProps = {
  positionId: string;
  onDismiss: () => void;
  onSubmit: (position_id: string, position: position) => void;
  show: boolean;
};

export const UpdateModalBody: FC<UpdateModalBodyProps> = ({positionId, onDismiss, onSubmit, show}) => {
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

  const fetchPosition = useCallback(async () => {
    if(positionId === ''){
      return;
    }
    const posInfo = await getPosition({position_id: positionId})
    console.log(posInfo)
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
  }, [positionId])

  // fetch the position metadata on modal load
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

  if (!show) {
    return null
  }
  return (
    <div className={styles.modal}>
      <div className={styles.body}>
        <h1 className={styles.header}>Edit Position Posting: {positionId}</h1>
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
            onClick={onDismiss}
          >
            Cancel
          </Button>
          <Button
            className={styles.submitButton}
            size={'sm'}
            onClick={() => onSubmit(positionId, {"_id": positionId, clubId, name, description, numberOfOpenings: numOpenings, q: questions, skills})}
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};