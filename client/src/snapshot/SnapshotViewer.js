import React from 'react';
import Editor from '@monaco-editor/react';
import { List, Segment } from 'semantic-ui-react';

import './snapshotViewer.css';

const SnapshotViewer = ({ locations, metadata }) => {
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
                        }, locations && locations.length > 5 ? 600 : 300)
                    }}
                />
            </div>

            <div className="side-container">
                <div className="metadata">
                    <h2 style={{ fontWeight: '200' }}>Metadata</h2>
                    {/* <Editor
                        disabled
                        theme="dark"
                        language="json"
                        value={JSON.stringify(snapshot)}
                        editorDidMount={(_, editor) => {
                            setTimeout(() => { editor.getAction('editor.action.formatDocument').run() }, 300)
                        }}
                    /> */}
                    <Segment inverted>
                        <List divided inverted relaxed>
                            {makeListItem("Repository",metadata[0].repo,0)}
                            {makeListItem("Owner",metadata[0].org,1)}
                            {metadata.map(({ key, value }, index) =>  (makeListItem(key,value,index+2)))}
                        </List>
                    </Segment>
                </div>
                {/* <div className="alerts">
                    <Editor
                        disabled
                        theme="dark"
                        language="json"
                        value={JSON.stringify(snapshot)}
                        editorDidMount={(_, editor) => {
                            setTimeout(() => { editor.getAction('editor.action.formatDocument').run() }, 300)
                        }}
                    />
                </div> */}
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

export default SnapshotViewer;