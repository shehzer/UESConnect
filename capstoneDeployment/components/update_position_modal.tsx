import React, {FC, useCallback, useEffect, useState} from "react";
import {Button, Modal, Text, Textarea, Input} from "@nextui-org/react";
import styles from '../styles/create_position_modal.module.css'
import { position } from '../public/interfaces/position.interface'
import {getPosition} from "../services/positions-service";
import DeleteIcon from "../pages/club-view/components/DeleteIcon";


type UpdateModalBodyProps = {
  positionId: string;
  onDismiss: () => void;
  onSubmit: (position_id: string, position: position) => void;
  show: boolean;
  readonly: boolean;
};

export const UpdateModalBody: FC<UpdateModalBodyProps> = ({positionId, onDismiss, onSubmit, show, readonly}) => {
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

  function removeQuestion(pos:number) {
    let tempQuestions = questions
    tempQuestions.splice(pos, 1)
    setQuestions([...tempQuestions])
  }

  function removeSkill(pos:number) {
    let tempSkills = skills
    tempSkills.splice(pos, 1)
    setSkills([...tempSkills])
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
  }, [fetchPosition, show])

  const questionList = questions.map((question, i) => {
    return (
      <div className={styles.questionContainer} key={'question' + (i+1)} id={'question' + (i + 1)}>
        <Text className={styles.inputLabel}>{'Question ' + (i + 1)}</Text>
        <div className={styles.questionLine}>
          <Input
            readOnly={readonly}
            width={'85%'}
            type={'text'}
            className={styles.question}
            value={question}
            onChange={({ target }) => {
              questions[i] = (target as HTMLInputElement).value
              setQuestions([...questions])
            }}
          />
          {!readonly &&
            <Button flat icon={<DeleteIcon size={20} fill="#FF0080" height={undefined} width={undefined} />} color={'error'} auto onPress={() => removeQuestion(i)}/>
          }
        </div>
      </div>
    )
  })

  const skillList = skills.map((skill, i) => {
    return (
      <div className={styles.questionContainer} key={'skill' + (i+1)} id={'question' + (i + 1)}>
        <Text className={styles.inputLabel}>{'Skill ' + (i + 1)}</Text>
        <div className={styles.questionLine}>
          <Input
            readOnly={readonly}
            type={'text'}
            width={'85%'}
            className={styles.question}
            value={skill}
            onChange={({ target }) => {
              skills[i] = (target as HTMLInputElement).value
              setSkills([...skills])
            }}
          />
          {!readonly &&
            <Button flat icon={<DeleteIcon size={20} fill="#FF0080" height={undefined} width={undefined} />} color={'error'} auto onPress={() => removeSkill(i)}/>
          }
        </div>
      </div>
    )
  })


  return (
    <Modal width={'35%'} open={show} closeButton aria-labelledby={"Position Modal"} onClose={onDismiss}>
      <div>
        <Modal.Header>
          <Text b size={22}>
            {readonly ? "View Position" : "Edit Position"}
          </Text>
        </Modal.Header>
        <Modal.Body>
          <form className={styles.updateForm}>
            <div className={styles.field}>
              <Text >Position Name: </Text>
              <Input
                readOnly={readonly}
                width={'100%'}
                value={name}
                onChange={({ target }) =>
                  setName((target as HTMLInputElement).value)
                }
              />
            </div>
            <div className={styles.field}>
              <Text>Description: </Text>
              <Textarea
                readOnly={readonly}
                width={'100%'}
                value={description}
                onChange={({ target }) =>
                  setDescription((target as HTMLInputElement).value)
                }
              />
            </div>
            <div className={styles.field}>
              <Text># of Openings: </Text>
              <Input
                readOnly={readonly}
                width={'100%'}
                type={'text'}
                pattern={'[0-9]*'}
                value={numOpenings || ""}
                onChange={({ target }) =>
                  setNumOpenings(parseInt((target as HTMLInputElement).value))
                }
              />
            </div>
            <div className={styles.field}>
              <Text b>Application Questions: </Text>
              {questionList}
              {!readonly &&
                <Button flat bordered color={'primary'} auto
                        onPress={() => addQuestion()}
                >
                  Add Question
                </Button>
              }
            </div>
            <div className={styles.field}>
              <Text b>Skills: </Text>
              {skillList}
              {!readonly &&
                <Button flat bordered color={'primary'} auto
                        onPress={() => addSkill()}
                >
                  Add Skill
                </Button>
              }
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button flat bordered color={'error'} auto onPress={onDismiss}>
            Close
          </Button>
          {!readonly &&
            <Button flat bordered color={'primary'} auto
                    onPress={() => onSubmit(positionId, {"_id": positionId, clubId, name, description, numberOfOpenings: numOpenings, q: questions, skills})}>
              Update
            </Button>
          }
        </Modal.Footer>
      </div>
    </Modal>
  );
};