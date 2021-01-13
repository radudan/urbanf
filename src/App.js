import React from "react"
import AdminPage from "./components/AdminPage";
import Table from "./components/Table";

import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

function App() {

    return(
        <div>
            <main className='container'>
                <Router>
                    <Switch>
                        <Route path='/' exact component={Table} />
                        <Route path='/admin' exact component={AdminPage} />
                    </Switch>
                </Router>
            </main>
        </div>
    )
}
export default App


