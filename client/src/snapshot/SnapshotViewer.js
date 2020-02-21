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
                        setTimeout(() => { editor.getAction('editor.action.formatDocument').run() }, 100)
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
                            {metadata.map(({ key, value }, index) => (
                                <List.Item key={`${key}:${index}`}>
                                    <List.Content>
                                        <List.Header>{key}</List.Header>
                                        {value}
                                    </List.Content>
                                </List.Item>
                            ))}
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

export default SnapshotViewer;