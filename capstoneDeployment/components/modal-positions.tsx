import { CreateModalBody }from './create_position_modal'
import { UpdateModalBody } from './update_position_modal'
import { position } from '../public/interfaces/position.interface'
import {FC, useEffect, useState} from "react";

import styles from '../styles/modal-positions.module.css'

// import { Sidebar } from "../components";
// import { pageManifest } from "../page-manifest";
// import { getUsers, createUser, updateUser, deleteUser } from "../services";
import {
  getPositions,
  deletePosition,
  getPosition, updatePosition, createPosition,
} from '../services/positions-service'

export type PositionProps = {
  ID: string
  applicationNavigator: (position_id: string, positionName: string) => void
}

export const ClubPositions: FC<PositionProps> = ({ID, applicationNavigator}) => {
  const [sidebar, setSidebar] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<string>("");

  const [page, setPage] = useState(1);
  const [positionIdFilter, setPositionIdFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [descriptionFilter, setDescriptionFilter] = useState("");
  const [clubId, setClubId] = useState(ID);

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)

  const [positionArr, setPositionArr] = useState<position[]>([]);

  const searchPositions = async () => {
    setPage(1);

    setPositionArr(
      await getPositions({clubId})
    );
  };

  const incrementPage = () => setPage(page + 1);
  const decrementPage = () => setPage(page - 1);

  const handleUpdateSubmit = (
    id: string,
    positionInfo: position
  ) => {
    updatePosition(id, positionInfo).then(() => {
      dismissUpdateModal();
      searchPositions();
    });
  };

  const handleCreateSubmit = (
    positionInfo: position
  ) => {
    createPosition(positionInfo).then(() => {
      dismissCreateModal();
      searchPositions();
    })
  };

  const presentCreateModal = () => {
    setShowCreateModal(true)
  };

  const dismissCreateModal = () => {
    setShowCreateModal(false);
  }

  const presentUpdateModal = (positionId: string) => {
    setSelectedPosition(positionId);
    setShowUpdateModal(true);
  };

  const dismissUpdateModal = () => {
    setShowUpdateModal(false);
  }

  const removePosition = (id: string) => {
    deletePosition(id).then(() => {
      searchPositions()
    });
  };

  useEffect(() => {
    void searchPositions()
  }, [])

  const tableRows = positionArr.map((element, i) => {
    return (
      <tr className={styles.resultRow} key={i}>
        <th
          onClick={() => {
            presentUpdateModal(element._id);
          }}
        >
          {element._id}
        </th>
        <th
          onClick={() => {
            presentUpdateModal(element._id);
          }}
        >
          {element.clubId}
        </th>
        <th
          onClick={() => {
            presentUpdateModal(element._id);
          }}
        >
          {element.name}
        </th>
        <th
          onClick={() => {
            presentUpdateModal(element._id);
          }}
        >
          {element.description}
        </th>
        <th
          onClick={() => {
            presentUpdateModal(element._id);
          }}
        >
          {element.numberOfOpenings}
        </th>
        <th>
          <button
            className={styles.deleteButton}
            onClick={() => removePosition(element._id)}
            color="danger"
          >
            Delete
          </button>
        </th>
      </tr>
    );
  });

  return (
    <div>
      <CreateModalBody onDismiss={dismissCreateModal} onSubmit={handleCreateSubmit} show={showCreateModal} clubId={clubId}/>
      <UpdateModalBody positionId={selectedPosition} onDismiss={dismissUpdateModal} onSubmit={handleUpdateSubmit} show={showUpdateModal} />
      <header>
          <title>Position Postings</title>
      </header>
      <div>
        <div className={styles.pageTitle}>
            <h1>Position Postings</h1>
        </div>

        <div>
          <div className={styles.tableHolder}>
            <table className={styles.mainTable}>
              <thead>
              <tr>
                <th>Position ID</th>
                <th>Club ID</th>
                <th>Position Name</th>
                <th>Description</th>
                <th># of Openings</th>
                <th>Delete</th>
              </tr>
              </thead>
              <tbody>{tableRows}</tbody>
            </table>
          </div>
          <div className={styles.pageControl}>
            <button className={styles.pageButton} onClick={decrementPage}>
              Prev.
            </button>
            <p className={styles.plain}>Page: {page}</p>
            <button className={styles.pageButton} onClick={incrementPage}>
              Next
            </button>
          </div>
          <div className={styles.controlsContainer}>
            <form className={styles.filterForm}>
              <div className={styles.searchField}>
                <label>Position ID:</label>
                <input
                  value={positionIdFilter}
                  onChange={({ target }) =>
                    setPositionIdFilter((target as HTMLInputElement).value)
                  }
                />
              </div>
              <div className={styles.searchField}>
                <label>Position Name:</label>
                <input
                  value={nameFilter}
                  onChange={({ target }) =>
                    setNameFilter((target as HTMLInputElement).value)
                  }
                />
              </div>
            </form>
            <div className={styles.miscControls}>
              <button className={styles.searchButton} onClick={() => searchPositions()}>
                Search
              </button>
              <button className={styles.createButton} onClick={presentCreateModal}>
                Create New
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};