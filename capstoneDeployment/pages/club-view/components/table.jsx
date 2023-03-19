import { Table, Row, Col, Tooltip, User, Text } from "@nextui-org/react";
import  StyledBadgeWrapper  from "./StyledBadge";
import  IconButtonWrapper  from "./IconButton";
import  EditIconWrapper  from "./EditIcon";
import  DeleteIconWrapper  from "./DeleteIcon";
import {useState, React, useEffect} from 'react'
import { Modal, Button,  Input,  Checkbox } from "@nextui-org/react";
import Dropdown from './dropdown'
import { gql, useMutation } from '@apollo/client'
import client from '../../../components/apollo-client'

export default function table(props) {
    const [name, setName] = useState('')
    const [role, setRole] = useState('')
    const [year, setYear] = useState('')
    const [program, setProgram] = useState('')
    const [id, setID] = useState('')
    const [team, setTeam] = useState([...props.execs])
    const [visible, setVisible] = useState(false);
    const [editAction, setAction] = useState();
    const toggleHigh = ()=>{setVisible(true)}
    const toggleLow = ()=>{setVisible(false)}

    const columns = [
        { name: "NAME", uid: "name" },
        { name: "ROLE", uid: "role" },
        { name: "YEAR", uid: "year" },
        { name: "PROGRAM", uid: "program"},
        { name: "ACTIONS", uid: "actions" },
    ];

  function editUser(user, index){
    setName(user.name)
    setRole(user.role)
    setYear(user.year)
    setProgram(user.program)
    setID(user._id)
  }


  function clear()
  {
    setName('')
    setRole('')
    setYear('')
    setProgram('')
    setID('')

  }

  function handleConfirm()
  {
    switch(editAction)
    {
      case "edit":
        confirmEdit()
        break;
      case "delete":
        deleteUser()
        break;
      case "add":
        addUser()
        break;
      default:
        return ""
      
    }
  }


  function addUser()
  { 

    let temp = team.map((element, index)=>({...element}))
    temp.push({name:name, role:role, year:year, program:program})
    setTeam([...temp])
    toggleLow()

  }


  function deleteUser()
  {
    let temp = team.filter((element, index)=>(element._id!=id))
    console.log(temp)
    setTeam([...temp])
    toggleLow()
  }

  function confirmEdit()
  {
    let temp = team.map((element, index)=>({...element}))

    console.log(id, name, role, program, year)


    const newArr = temp.map((element, index)=>{

      if(id==element._id)
      {
        element.name=name
        element.year=year
        element.role=role
        element.program=program
      }

      return element
    })

    console.log(newArr)

    setTeam([...newArr])
    toggleLow()
  }

  function saveAll()
  {
    let sendTeam = team.map((element, index)=>({...element}))
    props.save(sendTeam)
  }


  function renderCell(user, columnKey){

    const cellValue = user[columnKey];
    
    switch (columnKey) {
      case "name":
        return (
          <User src={user.headshotURL}  name={cellValue} css={{ p: 0 }} >
         
          </User>
        );
      case "role":
        return (
          <Col>
            <Row>
              <Text b size={14} css={{ tt: "capitalize" }}>
                {cellValue}
              </Text>
            </Row>
            <Row>
              <Text b size={13} css={{ tt: "capitalize", color: "$accents7" }}>
                {user.team}
              </Text>
            </Row>
          </Col>
        );
      case "year":
        return <StyledBadgeWrapper type={user.status}>{cellValue}</StyledBadgeWrapper>;

      case "actions":
        return (
          <Row justify="center" align="center">
            <Col css={{ d: "flex" }}>
              <Tooltip  content="Edit user">
                <IconButtonWrapper  onClick={() => {editUser(user, columnKey);  setAction('edit'); toggleHigh();} }>
                  <EditIconWrapper  size={20} fill="#979797" />
                </IconButtonWrapper>
              </Tooltip>
            </Col>
            <Col css={{ d: "flex" }}>
              <Tooltip
                content="Delete user"
                color="error"
                onClick={() => {editUser(user, columnKey); setAction('delete'); toggleHigh();  }}
              >
                <IconButtonWrapper >
                  <DeleteIconWrapper size={20} fill="#FF0080" />
                </IconButtonWrapper>
              </Tooltip>
            </Col>
          </Row>
        );
      default:
        return cellValue;
    }
  };
  return (

    <div>

    <Table
      aria-label="Example table with custom cells"
      css={{
        height: "auto",
        minWidth: "100%",
      }}
      selectionMode="none"
    >
      <Table.Header columns={columns}>
        {(column) => (
          <Table.Column
            key={column.uid}
            // hideHeader={column.uid === "actions"}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </Table.Column>
        )}
      </Table.Header>
      <Table.Body items={team}>
        {(item) => (
          <Table.Row key={item._id}>
            {(columnKey) => (
               
              <Table.Cell key={item._id+columnKey}  >{renderCell(item, columnKey)}</Table.Cell>
            )}
          </Table.Row>
        )}
      </Table.Body>
    </Table>

    <Button   onPress={()=>{clear(); setAction('add');toggleHigh() }} className="my-10 bg-blue-600">
        Add Team Member
    </Button>

    <Button onPress={saveAll} className="my-10 bg-green-600">
        Save
    </Button>

    <Modal
        closeButton
        aria-labelledby="team-editor"
        open={visible}
        onClose={toggleLow}
      >
        <Modal.Header aria-labelledby="team-header" >
          <Text id="modal-title" size={18}>
            Team Editor
          </Text>
        </Modal.Header>
       {editAction!="delete"?
       <Modal.Body aria-labelledby="team-body"  >
       
         <Input
          aria-labelledby="team-name"
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            placeholder= {name?name:"Name"}
            onChange={(e)=>{setName(e.target.value)}}
  
          />
          <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            placeholder={role?role:"Role"}
            onChange={(e)=>{setRole(e.target.value)}}
            aria-labelledby="role"
           
          />
          <Text style={{alignSelf:"center"}} >Year</Text>
          <Dropdown type="year" initial={year} save={setYear}/>
          <Text style={{alignSelf:"center"}}>Program</Text>
          <Dropdown type="program" initial={program} save={setProgram}/>

      
        </Modal.Body>
        : 
        <Modal.Body>
            <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            disabled
            placeholder={name}
            aria-labelledby="team-program"
          />
      </Modal.Body>
      
      }
        <Modal.Footer aria-labelledby="team-footer" >
           {editAction!="delete"?<Button  bordered color='primary' onPress={handleConfirm}>Confirm</Button>:
           <Button className="bg-rose-600" color='error' onPress={handleConfirm}>DELETE</Button> }
            <Button  bordered color='error' onPress={toggleLow}>Cancel</Button>

        </Modal.Footer>
      </Modal>
    </div>
  );
}
