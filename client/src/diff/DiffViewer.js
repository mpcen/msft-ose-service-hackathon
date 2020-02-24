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
                    options={{
                        minimap: { enabled: false }
                    }}
                    original={JSON.stringify(locationsLHS[0])}
                    modified={JSON.stringify(locationsRHS[0])}
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