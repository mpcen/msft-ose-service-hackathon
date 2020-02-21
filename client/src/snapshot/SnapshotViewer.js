import React from 'react';
import Editor from '@monaco-editor/react';
import { List } from 'semantic-ui-react';

import './snapshotViewer.css';

const SnapshotViewer = ({ snapshot, locations, metadata }) => {
    return (
        <div className="snapshot-viewer-container">
            <div className="editor-container">
                <h2>Locations</h2>
                <Editor
                    theme="light"
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
                    <h2>Metadata</h2>
                    {/* <Editor
                        disabled
                        theme="dark"
                        language="json"
                        value={JSON.stringify(snapshot)}
                        editorDidMount={(_, editor) => {
                            setTimeout(() => { editor.getAction('editor.action.formatDocument').run() }, 300)
                        }}
                    /> */}
                    <List celled>
                        {metadata.map(({ key, value }) => (
                            <List.Item>
                                <List.Content>
                                    <List.Header>{key}</List.Header>
                                    {value}
                                </List.Content>
                            </List.Item>
                        ))}
                    </List>
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