import { Table, Row, Col, Tooltip, User, Text } from "@nextui-org/react";
import React, { useState } from 'react'
import Link from 'next/link'

export default function PositionsTable(props) {
    const [isReadMore, setIsReadMore] = useState(true) //state to check if user has selected readmore
    const handleReadMore = () => {
        //sets isLiked to the opposite of the current isReadMore
        setIsReadMore(!isReadMore)
    }
    const columns = [
        { name: "POSITION", uid: "name" },
        { name: "OPENINGS", uid: "numberOfOpenings" },
        { name: "SKILLS", uid: "skills" },
        { name: "APPLY", uid: "_id" },
        { name: "ACTIONS", uid: "actions" },
    ];

    const href = '/student-view/student-positions/'

    const renderCell = (user, columnKey) => {
        const cellValue = user[columnKey];
        switch (columnKey) {
            case "name":
                return (
                    <div className="text-slate-800 font-bold">
                        {cellValue}
                    </div>
                );
            case "numberOfOpenings":
                return (
                    <div className='text-sm text-slate-800 max-w-sm'>
                        {cellValue}
                    </div>
                );
            case "skills":
                return (
                    <div className="flex self-center space-x-2">
                        {cellValue[0] != null
                            ?
                            cellValue.map((skill) => (
                                <div className="self-center flex flex-row text-slate-50">
                                    <div className="bg-slate-500 text-base font-bold rounded-md px-2">
                                        {skill.skill}
                                    </div>
                                </div>
                            ))
                            : ''}
                    </div>

                );
            case "_id":
                return (
                    <div className="rounded shadow-md text-center">
                        <Link
                            className="hover:text-slate-500 font-bold self-center text-slate-800"
                            href={href + cellValue}
                        >
                            Apply
                        </Link>
                    </div>

                );
            default:
                return cellValue;
        }
    };
    return (
        <Table
            aria-label=""
            selectionMode="none"
        >
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
            <Table.Body items={props.positions}>
                {(item) => (
                    <Table.Row key={item._id}>
                        {(columnKey) => (
                            <Table.Cell key={item._id + columnKey}>{renderCell(item, columnKey)}</Table.Cell>
                        )}
                    </Table.Row>
                )}
            </Table.Body>
        </Table>
    );
}
