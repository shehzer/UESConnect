import {FC, useState} from "react";
import styles from '../styles/create_position_modal.module.css'
import { position } from '../public/interfaces/position.interface'
import {Button, Modal, Text, Textarea, Input} from "@nextui-org/react";
import DeleteIcon from "../pages/club-view/components/DeleteIcon";

type CreateModalBodyProps = {
  onDismiss: () => void;
  onSubmit: (position: position) => void;
  show: boolean;
  clubId: string;
};

export const CreateModalBody: FC<CreateModalBodyProps> = ({ onDismiss, onSubmit, show, clubId }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [numberOpenings, setNumberOpenings] = useState<number>(0);
  const [questions, setQuest] = useState<Array<string>>([""]);
  const [skills, setSkills] = useState([""]);

  function addQuestion() {
    questions.push('')
    setQuest([...questions])
  }
  function removeQuestion(pos:number) {
    let tempQuestions = questions
    tempQuestions.splice(pos, 1)
    setQuest([...tempQuestions])
  }
  function addSkill() {
    skills.push('')
    setSkills([...skills])
  }
  function removeSkill(pos:number) {
    let tempSkills = skills
    tempSkills.splice(pos, 1)
    setSkills([...tempSkills])
  }

  const questionList = questions.map((question, i) => {
    return (
      <div className={styles.questionContainer} key={'question' + (i+1)} id={'question' + (i + 1)}>
        <Text className={styles.inputLabel}>{'Question ' + (i + 1)}</Text>
        <div className={styles.questionLine}>
          <Input
            type={'text'}
            width={'85%'}
            className={styles.question}
            onChange={({ target }) => {
              questions[i] = (target as HTMLInputElement).value
              setQuest([...questions])
            }}
          />
          <Button flat icon={<DeleteIcon size={20} fill="#FF0080" height={undefined} width={undefined} />} color={'error'} auto onPress={() => removeQuestion(i)}/>
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
            type={'text'}
            width={'85%'}
            className={styles.question}
            onChange={({ target }) => {
              skills[i] = (target as HTMLInputElement).value
              setSkills([...skills])
            }}
          />
          <Button flat icon={<DeleteIcon size={20} fill="#FF0080" height={undefined} width={undefined} />} color={'error'} auto onPress={() => removeSkill(i)}/>
        </div>
      </div>
    )
  })

  return (
    <Modal width={'35%'} closeButton aria-labelledby={'Create Position Modal'} open={show} onClose={onDismiss}>
      <div>
        <Modal.Header>
          <Text b size={22}>
            New Position
          </Text>
        </Modal.Header>
        <Modal.Body>
          <form className={styles.updateForm}>
            <div className={styles.field}>
              <Text >Position Name: </Text>
              <Input
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
                width={'100%'}
                type={'text'}
                pattern={'[0-9]*'}
                value={numberOpenings || ""}
                onChange={({ target }) =>
                  setNumberOpenings(parseInt((target as HTMLInputElement).value))
                }
              />
            </div>
            <div className={styles.field}>
              <Text b>Application Questions: </Text>
              {questionList}
              <Button flat bordered color={'primary'} auto
                      onPress={() => addQuestion()}
              >
                Add Question
              </Button>

            </div>
            <div className={styles.field}>
              <Text b>Skills: </Text>
              {skillList}
              <Button flat bordered color={'primary'} auto
                      onPress={() => addSkill()}
              >
                Add Skill
              </Button>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button flat bordered color={'error'} auto onPress={onDismiss}>
            Close
          </Button>
          <Button flat bordered color={'success'} auto
                  onPress={() => onSubmit({"_id": "", "clubId": clubId, "name": name, "description": description, "numberOfOpenings": numberOpenings, "q": questions, "skills": skills})}
          >
            Create
          </Button>
        </Modal.Footer>
      </div>

    </Modal>
  );
};