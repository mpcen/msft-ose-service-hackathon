import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

import Snapshot from './snapshot/Snapshot';
import Organization from './organization/Organization';

const App = () => {
    return (
        <div id="app" style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Router>
                <div>
                    <nav>
                        <ul>
                            <li><Link to="/">Snapshot</Link></li>
                            <li><Link to="/organization">Organization</Link></li>
                        </ul>
                    </nav>
                </div>

                <Switch>
                    <Route exact path="/">
                        <Snapshot />
                    </Route>
                    <Route exact path="/organization">
                        <Organization />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;