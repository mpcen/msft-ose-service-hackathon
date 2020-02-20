import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

import SnapshotForm from './snapshot/SnapshotForm';
import Organization from './organization/Organization';

const App = () => {
    return (
        <div style={{ padding: '0 20px' }}>
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
                        <SnapshotForm />
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