import { Dropdown } from "@nextui-org/react";
import {useState} from 'react'

export default function DropDown(props) {


  const programItems = [
    {key: "Artificial Intelligence System Engineering", name: "Artificial Intelligence System Engineering" },
    {key: "Chemical Engineering", name:"Chemical Engineering"},
    {key: "Software Engineering", name:"Software Engineering"},
    {key: "Mechanical Engineering", name:"Mechanical Engineering"},
    {key: "Civil Engineering", name:"Civil Engineering"},
    {key: "Electrical Engineering", name:"Electrical Engineering"},
    {key: "Integrated Engineering", name:"Integrated Engineering"},
    {key: "Mechatronic Engineering", name:"Mechatronic Engineering"}
  ]

  const yearItems = [{key: "1", name:"1" },
  {key: "2", name:"2" },
  {key: "3", name:"3" },
  {key: "4", name:"4" },
  {key: "5", name:"5" }]


  const [selection, setSel] = useState(props.initial)

  const onChange = (selection)=>{


    setSel(selection.currentKey)
    props.save(selection.currentKey)

  }

  return (
    <Dropdown >
      <Dropdown.Button className="bg-blue-600" >{selection}</Dropdown.Button>
      <Dropdown.Menu 
      aria-label="Dynamic Actions" 
      selectionMode="single"
      variant="solid"
      disallowEmptySelection
      onSelectionChange={(sel)=>{
        onChange(sel)
      }}

      items={props.type=="program"?programItems:yearItems}
      

      >
   
        {(item) => (
          <Dropdown.Item
            key={item.key}
            withDivider
            className="w-70"
          >
            {item.name}
          </Dropdown.Item>
        )}




      </Dropdown.Menu>
    </Dropdown>
  );
}
