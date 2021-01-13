// import React, {useState, useContext, createContext, useEffect} from "react"
// import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
//
// function Learn({param1, param2, function1}) {
//     //Javascript here
//     // {} whatever is between brackets will be treated as javascript
//     const aFunction =() =>{}
//     const ablockOfdata = [{a:1, b:2}]
//
//     //useState function
//     const [allValues, setAllValues] = useState([{a:1, b:2}]) //useState is a special react function which rerender the page when state changes
//     //when we use set as the second parameter, it will modify the values: [myvalue, setMyValue} IMPORTANT use SET
//
//     //useContext function
//     //in the CHILD class:
//     const MyChildContext = createContext(); //here we create the context, USE export
//     function ChildClass (props) {
//         const[values, setValues] = [{a:1, b:2}]
//         return(
//             <MyChildContext.Provider value={{values, setValues}}>
//                 {props.children}
//             </MyChildContext.Provider>
//         )
//     }
//
//     //in parent class:
//     function sibling() {
//         //import the MyChildContext import{MychildContext} from ChildClass
//         const [data, setData] = useContext(MyChildContext); //here we receive the context
//         return (<h1>data.a</h1>)
//     }
//     //in PARENT class
//     <ChildClass>
//     {/*    Whatever forms are here, will have access to CONTEXT as long as they are wrapped in ChildClass*/}
//     </ChildClass>
//
//
//     //check for changes, can be run in the functon
//     const [time, setTime] = useState(Date.now());
//     useEffect(() => {
//         const interval = setInterval(() =>
//             setTime(Date.now()), 1000);
//         return () => {
//             clearInterval(interval);
//         };
//     }, []); //Adding [] at the end runs AFTER rendering, removing [] will run EVERY
//     //also [prop] will rerun if the prop is CHANGED
//
//     //this is to increment:
//     const [counter, setCounter] = useState(1);
//     useEffect(() => {
//         const interval = setInterval(() => setCounter((counter)=> counter+1), 1000);
//         return () => {
//             clearInterval(interval);
//         };
//     },[])
//
//     //Fetching data
//     const fetchData = async () =>{
//         const data = await fetch("http://bla.bl");
//         return await data.json();
//     }
//
//     //CSS styles:
//     // nav{align-items: center} will be applied to the element nav by default
//         //.nav-color{color:blue} have to be applied to element using classname <input classname=nav-color>
//     const modifyStateData = () =>{ setAllValues((prev) => prev.a +1)} //prev returns the previous STATE of the value
//     const [toggle, setToggle] = useState(false)
//     const modifyToggle =() => {setToggle((prev)=> !prev)} //this will toggle the boolean from previous state
//     const aMapValue =() =>{ (values) => {return {...values, someValueFromMap: "NEW Value"}}} //returns the initial aMapValue but modified a field
//     const grabInputValue = (value) =>{ console.log(value.target.value)}
//
//     //Using routers to display pages
//     //import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
//     return(
//         <Router>
//          <div className="App">
//              <NavBar />//if you have
//              <Switch>
//              <Route path="/" exact component={Home} /> //exact makes sure that only for / will match
//              <Route path="/about" exact component={About} />
//              </Switch>
//          </div>
//         </Router>
//     )
//     //How to change the Route from child
//     return (
//         <div>
//         <Link to={'/'}>"Title" </Link>
//         </div>
//     )
//     return (
//         <div className="learn"> //className will set the styles
//         {/*import first the class, by ex Today, than you can send data
//          <Today details={aFunction} /> this is how we send data to the Today function
//          IMPORTANT that you can send data only from the PARENT class to children*/}
//          <input onChange={grabInputValue}/> //here I can send the field value to the grabInputValue function
//             {ablockOfdata.map(functionData =>(
//                 <AnImportedClass firstVal={functionData.a} secondVal={functionData.b}}/>
//             ))}
//             {/*HOW to change the state from CHILD to parent
//             <buton onClick=function1>*/}
//         </div>
//     )
//
// }
//
// export default Learn;