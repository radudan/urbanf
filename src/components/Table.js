import React, {useMemo, useEffect, useState} from "react";
import { useTable, useExpanded } from "react-table";
import "./index.module.css"
import '../App.css'
import PropTypes from "prop-types";
import Input from "./Input";
import Button from "./Button";
import {waitSec} from "./Utils";
import urbImg from "./urban.jpg"
import {Logo, performFetch, Title} from "./CommonComponents";

function Table() {
    const data = useCells()
    const columns = useColumns()

    const [weekly, setWeekly] = useState([]);
    const [update, setUpdate] = useState(false)
    const [week, setWeek] = useState('currentweek');
    const [dates, setDates] = useState([]);

    useEffect(() => {
        async function getWeek() {
            let r =  await (performFetch(week));
            setWeekly(r);
            let datesday = await performFetch(week +'days');
            setDates(datesday)
        }
        getWeek();
    }, [update, week])

    return(
        <React.Fragment>
            <Logo />
            <Title update={update} setUpdate={setUpdate} week={week} setWeek={setWeek} dates={dates}/>
            <TableRend columns={columns} data={data} weekly = {weekly} setUpdate={setUpdate} update={update}/>
            <Location/>
        </React.Fragment>
    )

}


function Location() {
    const openLink =() => { window.open('https://goo.gl/maps/EKaVT6hiChngNWpk7','_blank')}
    return(
        <>
        <div className='data-cell' >
           <p  className='paragraph-link' onClick={openLink}>Haga clic aqui para direcciones</p>
            <img className='image-link' src={urbImg} onClick={openLink}/>

        </div>
        </>
    )
}



function extrData(weekly, keyVal) {
    let resp = {a:"",h:"-", c:'no'}
    if(weekly[keyVal] !== undefined)
        resp =  weekly[keyVal]
    return resp
}

function TableRend({columns, data, weekly, setUpdate, update}) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state: {expanded},
    } = useTable({ columns, data }, useExpanded);

    return (
        <div className="container">
            <table {...getTableProps()}>
                <TableHead headerGroups={headerGroups}/>
                <tbody {...getTableBodyProps()}>
                {rows.map(row => {prepareRow(row);
                    return (
                        <React.Fragment>
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return(
                                        <TableCell cell={cell} weekly={weekly} setUpdate={setUpdate} update={update} />
                                    )})}
                            </tr>
                        </React.Fragment>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}

function TableHead({headerGroups}) {
    return (
        <thead>
        {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                ))}
            </tr>
        ))}
        </thead>
    )
}

function TableCell({cell, weekly, setUpdate, update}) {
    return (
        <>
            <td {...cell.getCellProps()}>
                <div className='data-cell'>
                    <p >{extrData(weekly, cell.value).d}</p>
                    <p className='describe-data'>{
                        (!extrData(weekly, cell.value).h.includes('-'))?'HORA':''}</p>
                    <p className='add-bottom'>{extrData(weekly, cell.value).h}</p>
                    {(extrData(weekly, cell.value).c === 'no') ?
                        (!extrData(weekly, cell.value).h.includes('-'))?
                            <>
                                <p className='describe-data'>DISPONIBLE</p>
                                <span className='add-bottom'>{extrData(weekly, cell.value).a}</span>
                                <SubmitForms cell={extrData(weekly, cell.value)} setUpdate={setUpdate} update={update} />
                            </>
                        : <p>{extrData(weekly, cell.value).d}</p>
                    :<div className='data-cell'>
                        <p className='canceled-workout'> ENTRIENAMENTO CANCELADO </p>
                        <p className='cancel-reason'>{weekly[cell.value].c}</p>
                        </div>
                    }
                </div>
            </td>
        </>
    );
}

function SubmitForms({cell, setUpdate, update}) {
    const [FirstName,setFirstName] = useState('');
    const [SurName,setSurName] = useState('');
    const [message, setmessage] = useState('');
    const handleSubmit = async () => {
        let reqParams = `addusers?day=${cell.d}&hour=${cell.h}
            &fname=${FirstName}&sname=${SurName}`
        //console.log(reqParams)
        setFirstName('');
        setSurName('');
        const results = await performFetch(reqParams);
        setmessage(results.message)
        await waitSec(3)
        setUpdate(!update);
        setmessage('');
    }
    if(cell.a > 0){
        return(
            <>
                <Input className='cancel-input'
                    type="text"
                    placeholder="Enter Text"
                    label="Primer Nombre"
                    name="typeText"
                    required={true}
                    value={FirstName}
                    onChange={({value})=>setFirstName(value)}
                />
                <Input className='cancel-input'
                    type="text"
                    placeholder="Enter Text"
                    label="Apellido"
                    name="typeText"
                    required={true}
                    name="Surname"
                    value={SurName}
                    onChange={({value})=>setSurName(value)}
                />
                <Button
                    // className='button-container'
                    label="Participar"
                    onClick={handleSubmit}
                    disabled={(FirstName !== ''& SurName !== '')?false:true}
                />
                    <p className='message'>{message}</p>
            </>
        )}
    else return(<><p className='group-closed'>GRUPO CERADO</p>
    <p className='cancel-reason'>Completo</p></>)
}


let cellKeys = [
    {
        Monday: 'Mondaymh',
        Tuesday: 'Tuesdaymh',
        Wednesday: 'Wednesdaymh',
        Thursday: 'Thursdaymh',
        Friday: 'Fridaymh',
        Saturday:'Saturdaymh',
        Sunday:'Sundaymh'
    },
    {
        Monday: 'Mondaysh',
        Tuesday: 'Tuesdaysh',
        Wednesday: 'Wednesdaysh',
        Thursday: 'Thursdaysh',
        Friday: 'Fridaysh',
        Saturday:'Saturdaysh',
        Sunday:'Sundaysh'
    },
    {
        Monday: 'Mondayeh',
        Tuesday: 'Tuesdayeh',
        Wednesday: 'Wednesdayeh',
        Thursday: 'Thursdayeh',
        Friday: 'Fridayeh',
        Saturday:'Saturdayeh',
        Sunday:'Sundayeh'
    }
]

function useCells() {
    return useMemo(() => cellKeys, [])
}

function useColumns() {
    const columns = useMemo(
        () => colValues,
        []
    );

    return columns;
}

let colValues =  [{
    Header: "Lunes",
    accessor: "Monday"
},
    {
        Header: "Martes",
        accessor: "Tuesday"
    },
    {
        Header: "Mercoles",
        accessor: "Wednesday"
    },
    {
        Header: "Jueves",
        accessor: "Thursday"
    },
    {
        Header: "Viernes",
        accessor: "Friday"
    },
    {
        Header: "Sabado",
        accessor: "Saturday"
    },
    {
        Header: "Domingo",
        accessor: "Sunday"
    }
]


export default Table;


let propTypes = {
    onClick: PropTypes.func,
    children: PropTypes.node,
    variant: PropTypes.string,
    className: PropTypes.string,
    label: PropTypes.string,
    size: PropTypes.string,
    disabledClassName: PropTypes.string,
    disabled: PropTypes.bool
};

let defaultProps = {
    className: "",
    label: "",
    size: "",
    variant: "basic",
    disabled: false,
    disabledClassName: ""
};