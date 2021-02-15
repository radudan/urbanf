import React, {useMemo, useEffect, useState} from "react";
import { useTable, useExpanded } from "react-table";
import "./index.module.css"
import './CommonComponents'
import PropTypes from "prop-types";
import Input from "./Input";
import Button from "./Button";
import {waitSec} from "./Utils";
import {Logo, performFetch, Title} from "./CommonComponents";

function AdminPage() {
    const data = useCells()
    const columns = useColumns();

    const [weekly, setWeekly] = useState([]);
    const [update, setUpdate] = useState(false);
    const [week, setWeek] = useState('currentweek');
    const [defaults, setDefaults] = useState({morning:"0", siesta:"2", evening:"1", maxusers:"18"});
    const [dates, setDates] = useState([]);

    useEffect(() => {
        async function getWeek() {
            let datesday = await performFetch(week +'days');
            setDates(datesday)
            let fetchDefaults = await (performFetch('defaults'));
            setDefaults(fetchDefaults);
            let fetchWeek =  await (performFetch(week));
            setWeekly(fetchWeek);
        }
        getWeek();
    }, [update])

    return(
        <React.Fragment>
            <Logo />
            <Title update={update} setUpdate={setUpdate} week={week} setWeek={setWeek} dates={dates}/>
            <TableRend columns={columns} data={data} weekly = {weekly} setUpdate={setUpdate} update={update} defaults={defaults} dates={dates}/>
            <DefaultValues update={update} setUpdate={setUpdate} defaults={defaults} setDefaults={setDefaults}/>
        </React.Fragment>
    )

}

function extrData(weekly, keyVal, dates) {
    let date = dates[keyVal.substring(0, keyVal.length-2)];
    let h = keyVal.endsWith("eh")?19:keyVal.endsWith("sh")?15:10;
    let resp = {a:"-",h:h, date:date, day:keyVal.substring(0, keyVal.length-2),c:'no'}
    if(weekly[keyVal] !== undefined)
        resp =  weekly[keyVal]
    return resp
}

function DefaultValues({update, setUpdate, defaults, setDefaults}) {
    const [morning, setMorning] = useState(defaults.morning);
    const [siesta, setSiesta] = useState(defaults.siesta);
    const [evening, setEvening] = useState(defaults.evening)
    const [maxusers, setMaxusers] = useState(defaults.maxusers)
    const [message, setMessage] = useState('');

    useEffect(() => {
        setMorning(defaults.morning)
        setSiesta(defaults.siesta);
        setEvening(defaults.evening)
        setMaxusers(defaults.maxusers)
    }, [update, defaults])

    const changeDef = async () =>{
        let request = `changedefaults?morning=${morning}&siesta=${siesta}&evening=${evening}&maxusers=${maxusers}`
        let resp = await performFetch(request);
        setMessage(resp.message);
        await waitSec(2);
        setMessage('')
        setUpdate(!update)
    }

    return (

            <div className='default-values'>
                <table>
                    <thead><tr><th>{'Valores Predeterminados'}</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                            <Input
                                label={'Manana'}
                                name={'morning'}
                                value={morning}
                                onChange={({value})=>setMorning(value)}
                            />
                                <Input
                                    label={'Siesta'}
                                    name={'siesta'}
                                    value={siesta}
                                    onChange={({value})=>setSiesta(value)}
                                />
                            <Input
                                label={'Tarde'}
                                name={'evening'}
                                value={evening}
                                onChange={({value})=>setEvening(value)}
                            />
                            <Input
                                label={'Personas Maximas'}
                                name={'maxusers'}
                                value={maxusers}
                                onChange={({value})=>setMaxusers(value)}
                            />
                            <Button label={'Cambiar'} onClick={changeDef}/>
                            <p style=
                                   {{color: 'red', display: 'flex', justifyContent: 'center'}}>{message}</p>
                        </td>
                        </tr>
                    </tbody>
                </table>
            </div>
    );
}

function TableRend({columns, data, weekly, setUpdate, update, defaults, dates}) {
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
                                {row.cells.map((cell,i) => {
                                    return(
                                        <TableCell key={i} cell={cell} weekly={weekly} setUpdate={setUpdate} update={update} defaults={defaults} dates={dates}/>
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

function TableCell({cell, weekly, setUpdate, update, defaults, dates}) {
    return (
        <React.Fragment >
            <td align="justify" {...cell.getCellProps()}>
                <div className='data-cell'>
                    {extrData(weekly, cell.value, dates).d && <p className='cell-date'>{extrData(weekly, cell.value, dates).d}</p>}
                    { (extrData(weekly, cell.value, dates).c === 'no') ?
                        (!extrData(weekly, cell.value, dates).a.includes('-'))?
                        <CurrentWorkouts cell={extrData(weekly, cell.value, dates)} setUpdate={setUpdate} update={update} />
                        :<CreateWorkout cell={extrData(weekly, cell.value, dates)} defaults={defaults} update={update} setUpdate={setUpdate}/>
                    :<>
                            <p className='canceled-workout'> ENTRIENAMENTO CANCELADO </p>
                            <p className='cancel-reason'>{weekly[cell.value].c}</p>
                    </>

                    }
                </div>
            </td>
        </React.Fragment>
    );
}

function CreateWorkout({cell, defaults, update, setUpdate}) {
    let hour = (cell.h < 12)?defaults.morning:(cell.h > 18)?defaults.evening:defaults.siesta;
    const [details, setDetails] = useState([]);
    const [message, setMessage] = useState('');
    useEffect(()=>{setDetails({hour:hour, maxusers: defaults.maxusers})},[defaults]);
    const updateInput =({name, value}) =>{
        let newD = {hour:details.hour,maxusers:details.maxusers};
        newD[name] = value;
        setDetails(newD);
    }
    const addWorkout = async () =>{
        let reqQuery = `addworkout?day=${cell.day}&date=${cell.date}&hour=${details.hour}&max=${details.maxusers}`;
        let rezults = await performFetch(reqQuery);
        setMessage(rezults.message)
        setUpdate(!update);
    }
    return(
        <>
            <p className='cell-date'>{cell.date}</p>
            <Input label={'HORA'} name={'hour'}
                   value={details.hour} onChange={updateInput} />

            <Input label={'Personas Maximas'}
                   name={'maxusers'}
                   value={details.maxusers} onChange={updateInput} />

            <Button className='admin-button'  label={'Nuevo Entrenamiento'}  onClick={addWorkout}/>
            <p>{message}</p>
        </>
    )

}

function CurrentWorkouts({cell, setUpdate, update}) {
    const [users, setUsers] = useState([]);
    const [reason, setReason] = useState('Iluviar');

    const cancelWorkout = async () =>{
        let query = `cancelworkout?date=${cell.d}&hour=${cell.h}&reason=${reason}`;
        let rezult = await performFetch(query);
        setUpdate(!update);
    }
    useEffect(() => {
        const getJoiningUsers = async () => {
            let reqParams = `joining?date=${cell.d}&hour=${cell.h}`;
            const results = await performFetch(reqParams);
            setUsers([results]);
        }
        getJoiningUsers();
    },[update])

    return(
        <>
            <div className='data-cell'>
                {users.map(users => {
                    let r = []
                    for(let i = 0; i < users.length; i++) {
                        r.push(<CancelUsr user={users[i]} update={update} setUpdate={setUpdate} />)
                    }
                    return r;
                })}
                <Input className='cancel-input' label={'Causa'} name={'reason'} value={reason} onChange={({value})=>setReason(value)}/>
                <Button variant='danger' className='cancel-all' label={'Cancelar Entrenamento'} onClick={cancelWorkout}/>
            </div>

        </>
    )
}

function CancelUsr({user, update, setUpdate}) {
    const cancelUser = async () => {
        let reqParams = `canceluser?date=${user.date}&hour=${user.hour}
            &fname=${user.fname}&sname=${user.sname}`
        const results = await performFetch(reqParams);
        setUpdate(!update);
    }
    return (
        <div className='cancel-container'>
            <p className='capitalize'>{user.fname + " " + user.sname}</p>
            <Button variant='danger' className='cancel-btn' label={'eliminar'} onClick={cancelUser}/>
        </div>
    )
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


export default AdminPage;


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