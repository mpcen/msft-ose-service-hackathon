import React from 'react';
import Editor from '@monaco-editor/react'

const SnapshotViewer = ({ snapshot }) => {
    return (
        <div style={{ marginTop: '24px', height: '70%' }}>
            <Editor
                disabled
                theme="dark"
                language="json"
                value={JSON.stringify(snapshot)}
                editorDidMount={(_, editor) => {
                    setTimeout(() => { editor.getAction('editor.action.formatDocument').run() }, 100)
                }}
            />
        </div>
    );
}

export default SnapshotViewer;