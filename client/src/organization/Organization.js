import React from 'react';
import { Form, Button } from 'semantic-ui-react';
import Editor from '@monaco-editor/react';

import useForm from './useForm';

import './organization.css';

const INITIAL_STATE = {
    owner: 'owner',
    type: 'npm',
    name: 'express',
    version: '4.0.0'
}

export default () => {
    const { values, handleChange, handleSubmit, data } = useForm(INITIAL_STATE);

    return (
        <div style={{ height: '100%', margin: '24px 20%' }}>
            <Form className="snapshot-form" onSubmit={handleSubmit}>
                <Form.Field required>
                    <label>Owner</label>
                    <input
                        required
                        name="owner"
                        placeholder='Owner'
                        value={values.owner}
                        onChange={handleChange}
                    />
                </Form.Field>
                <Form.Field required>
                    <label>Type</label>
                    <input
                        required
                        name="type"
                        placeholder='type'
                        value={values.type}
                        onChange={handleChange}
                    />
                </Form.Field>
                <Form.Field required>
                    <label>Name</label>
                    <input
                        required
                        name="name"
                        placeholder='name'
                        value={values.name}
                        onChange={handleChange}
                    />
                </Form.Field>
                <Form.Field required>
                    <label>Version</label>
                    <input
                        required
                        name="version"
                        placeholder='version'
                        value={values.version}
                        onChange={handleChange}
                    />
                </Form.Field>

                <Button
                    color="blue"
                    type="submit"
                >
                    Submit
                </Button>
            </Form>
            {
                data &&
                <div className="organization-data-viewer">
                    { 
                        data.length > 0 ?
                        <Editor
                            theme="dark"
                            language="json"
                            value={JSON.stringify(data)}
                            options={{
                                minimap: { enabled: false }
                            }}
                            editorDidMount={(_, editor) => {
                                setTimeout(() => {
                                    editor.getAction('editor.action.formatDocument').run()
                                }, data && data.length > 5 ? 600 : 300)
                            }}
                        />
                        :
                        <span>No branches or releases found.</span>
                    }
                </div>
            }
        </div>
    );
}