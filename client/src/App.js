import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';

import Snapshot from './snapshot/Snapshot';
import Organization from './organization/Organization';

import './app.css';

const App = () => {
    return (
        <div id="app" style={{  display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Router>
                <div style={{ backgroundColor: '#24292e', height: '70px', display: 'flex', alignItems: 'center' }}>
                    <nav>
                        <ul style={{ listStyle: 'none', display: 'flex', alignItems: 'center' }}>
                            <li style={{ marginRight: '48px', color: 'white' }}>
                                <Icon name="microsoft" size="big" />
                            </li>

                            <li style={{ marginRight: '14px', pointer: 'cursor' }}>
                                <Link to="/">
                                    <h4 className="nav-list-item">Snapshot</h4>
                                </Link>
                            </li>
                            <li>
                                <Link to="/organization">
                                    <h4 className="nav-list-item">Organization</h4>
                                </Link>
                            </li>
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