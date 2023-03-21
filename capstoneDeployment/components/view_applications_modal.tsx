import React, { FC, useCallback, useEffect, useState } from 'react'
import styles from '../styles/view_applications.module.css'
import { getApplications } from '../services/applications-service'
import {Text, Modal, Table, Col, Row, Tooltip} from '@nextui-org/react'
import { ApplicationModalBody } from "./application_modal";
import IconButtonWrapper from "../pages/club-view/components/IconButton";
import EyeIconWrapper from "../pages/club-view/components/EyeIcon";
import DownloadIconWrapper from "../pages/club-view/components/DownloadIcon";
import {applicationResponse} from "../public/interfaces/position.interface";
import EditIconWrapper from "../pages/club-view/components/EditIcon";
import DeleteIconWrapper from "../pages/club-view/components/DeleteIcon";
import {bool} from "prop-types";

export type ApplicationModalProps = {
  position_id: string;
  position_name: string;
  onDismiss: () => void;
  show: boolean;
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
  const [selectedApplication, setSelectedApplication] = useState<applicationResponse>({
    _id: "",
    name: "",
    email: "",
    description: "",
    resumeURL: "",
    qA: [{ answer: "", question: "" }]
  })
  const [showApplicationModal, setShowApplicationModal] = useState<boolean>(false)

  const columns = [
    {name: "APPLICANT NAME", uid: "name"},
    {name: "APPLICANT EMAIL", uid: "email"},
    {name: "DESCRIPTION", uid: "description"},
    {name: "ACTIONS", uid: "actions"}
  ]

  const handleDownload = function(downloadURL: string){

  }

  const displayApplicationModal = function(applic:applicationResponse){
    setSelectedApplication(applic)
    setShowApplicationModal(true)
  }

  const dismissApplicationModal = function(){
    setShowApplicationModal(false)
  }


  const renderRow = (applic: applicationResponse) => {
    return (
      <Table.Row key={applic._id}>
        <Table.Cell>
          <Col>
            <Row>
              <Text b size={16} css={{ tt: "capitalize" }}>
                {applic.name}
              </Text>
            </Row>
          </Col>
        </Table.Cell>
        <Table.Cell>
          <Col>
            <Row>
              <Text size={14} >
                {applic.email}
              </Text>
            </Row>
          </Col>
        </Table.Cell>
        <Table.Cell>
          <Col>
            <Row css={{maxWidth: '800px'}}>
              <Text size={14} css={{ tt: "capitalize", overflow: "clip", textOverflow: "ellipsis"}}>
                {applic.description}
              </Text>
            </Row>
          </Col>
        </Table.Cell>
        <Table.Cell>
          <Col>
            <Row justify="center" align="center">
              <Col css={{d: "flex"}}>
                <Tooltip content="Details">
                  <IconButtonWrapper onClick={() => displayApplicationModal(applic)}>
                    <EyeIconWrapper size={20} fill="#979797" height={undefined} width={undefined} />
                  </IconButtonWrapper>
                </Tooltip>
              </Col>
              <Col css={{d: "flex"}}>
                {applic.resumeURL !== "No Resume" &&
                <a href={applic.resumeURL}>
                    <Tooltip content="Download Resume">
                        <IconButtonWrapper onClick={() => null}>
                            <DownloadIconWrapper size={20} fill="#979797" height={undefined} width={undefined} />
                        </IconButtonWrapper>
                    </Tooltip>
                </a>
                }

              </Col>
            </Row>
          </Col>
        </Table.Cell>
      </Table.Row>
    );
  };

  const applicationsTable = (
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
      <Table.Body items={applicationsArr}>
        {(item: applicationResponse) => (renderRow(item))}
      </Table.Body>
    </Table>
  )


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
    <div>
      <ApplicationModalBody application={selectedApplication} onDismiss={dismissApplicationModal} show={showApplicationModal}/>
      <Modal width={'70%'} closeButton aria-labelledby={'View Applications Modal'} open={show} onClose={onDismiss}>
        <div className={styles.body}>
          <h1 className={styles.header}>
            Applications for position: {positionName}
          </h1>
          <div className={styles.contentContainer}>{applicationsTable}</div>
        </div>
      </Modal>
    </div>

  )
}
