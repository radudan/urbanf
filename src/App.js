import React from "react"
import AdminPage from "./components/AdminPage";
import Table from "./components/Table";
//import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import{HashRouter, Route} from "react-router-dom";

function App() {

    return(
        <div>
            <main className='container'>
                {/*<Router>*/}
                {/*    <Switch>*/}
                <HashRouter>
                        <Route exact path='/'  component={Table} />
                        <Route  path='/rubenadmin'  component={AdminPage} />
                </HashRouter>
                {/*    </Switch>*/}
                {/*</Router>*/}
            </main>
        </div>
    )
}
export default App


