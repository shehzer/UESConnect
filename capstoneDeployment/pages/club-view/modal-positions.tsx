import { CreateModalBody }from '../../components/create_position_modal'
import { UpdateModalBody } from '../../components/update_position_modal'
import { ApplicationsModalBody } from '../../components/view_applications_modal'
import { position } from '../../public/interfaces/position.interface'
import {FC, ReactElement, useEffect, useState} from "react";
import { Table, Row, Col, Tooltip, Text } from "@nextui-org/react";
import IconButtonWrapper from "./components/IconButton";
import EditIconWrapper from "./components/EditIcon"
import DeleteIconWrapper from "./components/DeleteIcon"
import EyeIconWrapper from "./components/EyeIcon";
import NoteIconWrapper from "./components/NoteIcon"

import styles from '../../styles/modal-positions.module.css'

import {
  getPositions,
  deletePosition,
  getPosition, updatePosition, createPosition,
} from '../../services/positions-service'

export type PositionProps = {
  ID: string
  applicationNavigator: (position_id: string, positionName: string) => void
}

export default function ClubPostions({ID, applicationNavigator}: PositionProps): ReactElement{
  const [selectedPositionName, setSelectedPositionName] = useState<string>("");
  const [selectedPosition, setSelectedPosition] = useState<string>("");

  const [page, setPage] = useState(1);
  const [positionIdFilter, setPositionIdFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [descriptionFilter, setDescriptionFilter] = useState("");
  const [clubId, setClubId] = useState(ID);

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showApplicationModal, setShowApplicationModal] = useState(false)

  const [positionArr, setPositionArr] = useState<position[]>([]);

  const columns = [
    {name: "POSITION NAME", uid: "name"},
    {name: "DESCRIPTION", uid: "description"},
    {name: "# OF OPENINGS", uid: "numberOfOpenings"},
    {name: "ACTIONS", uid: "actions"}
  ]

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

  const presentViewModal = (positionId: string) => {
    setSelectedPosition(positionId)
    setShowViewModal(true)
  }

  const dismissViewModal = () => {
    setShowViewModal(false)
  }

  const presentApplicationModal = (positionId: string, positionName: string) => {
    setSelectedPosition(positionId)
    setSelectedPositionName(positionName)
    setShowApplicationModal(true)
  }

  const dismissApplicationModal = () => {
    setShowApplicationModal(false)
  }

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
    console.log("i am running coles page")
    void searchPositions()
  }, [])

  const renderRow = (pos: position) => {
    return (
      <Table.Row key={pos._id}>
        <Table.Cell>
          <Col>
            <Row>
              <Text b size={16} css={{ tt: "capitalize" }}>
                {pos.name}
              </Text>
            </Row>
          </Col>
        </Table.Cell>
        <Table.Cell>
          <Col>
            <Row css={{maxWidth: '1000px'}}>
              <Text size={14} css={{ tt: "capitalize", overflow: "clip", textOverflow: "ellipsis"}}>
                {pos.description}
              </Text>
            </Row>
          </Col>
        </Table.Cell>
        <Table.Cell>
          <Col>
            <Row>
              <Text size={14}>
                {pos.numberOfOpenings}
              </Text>
            </Row>
          </Col>
        </Table.Cell>
        <Table.Cell>
          <Col>
            <Row justify="center" align="center">
              <Col css={{d: "flex"}}>
                <Tooltip content="Details">
                  <IconButtonWrapper onClick={() => presentViewModal(pos._id)}>
                    <EyeIconWrapper size={20} fill="#979797" height={undefined} width={undefined} />
                  </IconButtonWrapper>
                </Tooltip>
              </Col>
              <Col css={{d: "flex"}}>
                <Tooltip content="Applications">
                  <IconButtonWrapper onClick={() => presentApplicationModal(pos._id, pos.name)}>
                    <NoteIconWrapper size={20} fill="#979797" height={undefined} width={undefined} />
                  </IconButtonWrapper>
                </Tooltip>
              </Col>
              <Col css={{ d: "flex" }}>
                <Tooltip content="Edit">
                  <IconButtonWrapper onClick={() => presentUpdateModal(pos._id)}>
                    <EditIconWrapper size={20} fill="#979797" height={undefined} width={undefined} />
                  </IconButtonWrapper>
                </Tooltip>
              </Col>
              <Col css={{ d: "flex" }}>
                <Tooltip
                  content="Delete"
                  color="error"
                  onClick={() => removePosition(pos._id)}
                >
                  <IconButtonWrapper>
                    <DeleteIconWrapper size={20} fill="#FF0080" height={undefined} width={undefined} />
                  </IconButtonWrapper>
                </Tooltip>
              </Col>
            </Row>
          </Col>
        </Table.Cell>
      </Table.Row>
    );
  };

  return (

    <div>
      <CreateModalBody onDismiss={dismissCreateModal} onSubmit={handleCreateSubmit} show={showCreateModal} clubId={clubId}/>
      <UpdateModalBody positionId={selectedPosition} onDismiss={dismissUpdateModal} onSubmit={handleUpdateSubmit} show={showUpdateModal} readonly={false}/>
      <UpdateModalBody positionId={selectedPosition} onDismiss={dismissViewModal} onSubmit={() => null} show={showViewModal} readonly={true}/>
      <ApplicationsModalBody position_id={selectedPosition} position_name={selectedPositionName} onDismiss={dismissApplicationModal} show={showApplicationModal}/>
      <header>
        <title>Position Postings</title>
      </header>
      <div className={styles.container}>
        <div className={styles.pageTitle}>
          <Text size={'$4xl'}>Position Postings</Text>
        </div>

        <div>
          <div className={styles.tableHolder}>
            <Table aria-label="Positions Table"
                   css={{
                     height: "auto",
                     minWidth: "100%",
                     overflow: "hidden"
                   }}>
              <Table.Header columns={columns}>
                {(column) => (
                  <Table.Column
                    key={column.uid}
                    hideHeader={column.uid === "actions"}
                    align={column.uid === "actions" ? "center" : "start"}
                  >
                    {column.name}
                  </Table.Column>
                )}
              </Table.Header>
              <Table.Body items={positionArr}>
                {(item: position) => (renderRow(item))}
              </Table.Body>
            </Table>
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
}
