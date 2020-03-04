import React from 'react';
import { DiffEditor } from '@monaco-editor/react';
import { List, Segment } from 'semantic-ui-react';

import './diffViewer.css';

const DiffViewer = ({ locationsLHS, metadataLHS, locationsRHS, metadataRHS }) => {
    return (
        <div className="snapshot-viewer-container">
            <div className="editor-container">
                <h2 style={{ fontWeight: '200' }}>Locations</h2>
                <DiffEditor
                    theme="dark"
                    language="json"
                    options={
                        {
                            minimap: { enabled: false },
                            inDiffEditor: true,
                            formatOnPaste: true,
                            formatOnType: true,
                            originalEditable: true
                        }
                    }
                    original={JSON.stringify(locationsLHS)}
                    modified={JSON.stringify(locationsRHS)}
                    editorDidMount={async (originalEditorValue, modifiedEditorValue, editor) => {
                        setTimeout(() => {
                            editor.getOriginalEditor().getAction('editor.action.formatDocument').run();
                            editor.getModifiedEditor().getAction('editor.action.formatDocument').run();
                        }, locationsLHS && locationsRHS && locationsLHS.length > 5 ? 600 : 300)
                    }}
                />
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

export default DiffViewer;