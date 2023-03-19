import {FC, useState} from "react";
import styles from '../styles/create_position_modal.module.css'
import { position } from '../public/interfaces/position.interface'

type CreateModalBodyProps = {
  onDismiss: () => void;
  onSubmit: (position: position) => void;
  show: boolean;
  clubId: string;
};

export const CreateModalBody: FC<CreateModalBodyProps> = ({ onDismiss, onSubmit, show, clubId }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [numberOpenings, setNumberOpenings] = useState(0);
  const [questions, setQuestions] = useState([""]);
  const [skills, setSkills] = useState([""]);

  if (!show) {
    return null
  }
  return (
    <div className={styles.modal}>
      <div className={styles.contentContainer}>
        <div className={styles.title}>
          <p>
            New Position
          </p>
        </div>
        <form className={styles.updateForm}>
          <div className={styles.field}>
            <label>Position Name: </label>
            <input
              value={name}
              onChange={({ target }) =>
                setName((target as HTMLInputElement).value)
              }
            />
          </div>
          <div className={styles.field}>
            <label>Description: </label>
            <input
              value={description}
              onChange={({ target }) =>
                setDescription((target as HTMLInputElement).value)
              }
            />
          </div>
          <div className={styles.field}>
            <label># of Openings: </label>
            <input
              type={'text'}
              pattern={'[0-9]*'}
              value={numberOpenings}
              onChange={({ target }) =>
                setNumberOpenings(parseInt((target as HTMLInputElement).value))
              }
            />
          </div>
          <div className={styles.field}>
            <label>Application Questions: </label>
            <input
              value={questions}
              onChange={({ target }) =>
                setQuestions([(target as HTMLInputElement).value])
              }
            />
          </div>
          <div className={styles.field}>
            <label>Skills: </label>
            <input
              value={skills}
              onChange={({ target }) =>
                setSkills([(target as HTMLInputElement).value])
              }
            />
          </div>
        </form>
        <button
          className={styles.submitButton}
          onClick={() => onSubmit({"_id": "", "clubId": clubId, "name": name, "description": description, "numberOfOpenings": numberOpenings, "q": questions, "skills": skills})}
        >
          Create
        </button>
        <button className={styles.closeButton} onClick={onDismiss}>
          Close
        </button>
      </div>

    </div>
  );
};