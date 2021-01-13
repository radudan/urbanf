import React, {useEffect, useState} from 'react';
import urbanLogo from "./urbanLogo.jpg";
import Button from "./Button";

export function Logo(){
    return (
        <>
            <div className='data-cell'>
                <img  className='logo-image' src={urbanLogo}/>
            </div>
        </>
    )
}


export function Title({update, setUpdate, week, setWeek}) {
    const {next, previous, thisWeek, nextWeek} = {
        next:'PROXIMA SEMANA  >>>', previous:'<<<  SEMANA ACTUAL',
        thisWeek:'SEMANA ACTUAL', nextWeek:'PROXIMA SEMANA'}

    const [displayedWeek, setDisplayedWeek] = useState(next);
    const [title, setTitle] = useState(thisWeek);

    const changeWeek = () =>{
        if(week === 'currentweek') {
            setWeek('nextweek');
            setTitle(nextWeek)
            setDisplayedWeek(previous);
        }
        else{
            setTitle(thisWeek)
            setWeek('currentweek');
            setDisplayedWeek(next);
        }
        setUpdate(!update);
    }
    return (<>
            <div className={`header ${displayedWeek === next ? '' : 'reverse'}`}>
                <h1>{title}</h1>
                <Button className='week-button' onClick={changeWeek}>{displayedWeek}</Button>
            </div>
        </>
    )
}

export  async function performFetch(query){
    const data = await fetch("http://urbanfit.tocloud.in:3001/" + query);
    let resp = await data.json()
    //console.log(resp)
    return resp;
}