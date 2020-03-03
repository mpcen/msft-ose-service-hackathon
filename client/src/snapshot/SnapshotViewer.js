import React from 'react';
import Editor from '@monaco-editor/react';
import { List, Segment } from 'semantic-ui-react';

import './snapshotViewer.css';

const SnapshotViewer = ({ locations, metadata, alerts }) => {
    return (
        <div className="snapshot-viewer-container">
            <div className="editor-container">
                <h2 style={{ fontWeight: '200' }}>Locations</h2>
                <Editor
                    theme="dark"
                    language="json"
                    value={JSON.stringify(locations)}
                    options={{
                        minimap: { enabled: false }
                    }}
                    editorDidMount={(_, editor) => {
                        setTimeout(() => {
                            editor.getAction('editor.action.formatDocument').run()
                        }, locations && locations.length > 5 ? 700 : 400)
                    }}
                />
            </div>

            <div className="side-container">
                <div className="metadata">
                    <h2 style={{ fontWeight: '200' }}>Metadata</h2>
                    <Segment inverted>
                        <List divided inverted relaxed>
                            {makeListItem("Repository",metadata[0].repo,0)}
                            {makeListItem("Owner",metadata[0].org,1)}
                            {metadata.map(({ key, value }, index) =>  (makeListItem(key,value,index+2)))}
                        </List>
                    </Segment>
                </div>
                {
                    <div className="alerts">
                        <h2 style={{ fontWeight: '200' }}>Alerts</h2>
                        {
                            alerts && alerts.map(a => makeAlertItem(a))
                        }
                    </div>
                }
            </div>
        </div>
    );
}

function makeListItem(header, value, index){
    return <List.Item key={`${header}:${index}`}>
    <List.Content>
        <List.Header>{header}</List.Header>
        {value}
    </List.Content>
</List.Item>
}

function makeAlertItem(alert) {
    return <div style={{fontSize: '18px', margin: '30px 0'}}>
        <a style={{fontWeight: 'bold', margin: '5px 0'}} href={alert.vulnerabilities.vulnerabilities.summary[0].url}>{alert.vulnerabilities.vulnerabilities.summary[0].title}</a>
        <div >{alert.coordinate.type + " " + alert.coordinate.name + "@" + alert.coordinate.version}</div>
        <div style={{fontSize: '14px', margin: '15px 0'}}>{alert.vulnerabilities.vulnerabilities.summary[0].remediation}</div>
    </div>
}

export default SnapshotViewer;