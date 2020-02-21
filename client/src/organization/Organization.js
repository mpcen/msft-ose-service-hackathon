import React from 'react';
import { Form, Button, Label } from 'semantic-ui-react';
import Editor from '@monaco-editor/react';

import useForm from './useForm';

const INITIAL_STATE = {
    owner: 'owner',
    type: 'npm',
    name: 'react',
    version: '12.0.1'
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
                        name="owner"
                        placeholder='npm'
                        value={values.type}
                        onChange={handleChange}
                    />
                </Form.Field>
                <Form.Field required>
                    <label>Name</label>
                    <input
                        required
                        name="name"
                        placeholder='react'
                        value={values.name}
                        onChange={handleChange}
                    />
                </Form.Field>
                <Form.Field required>
                    <label>Version</label>
                    <input
                        required
                        name="owner"
                        placeholder='12.0.1'
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
                data && data.length > 0 &&
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
            }
        </div>
    );
}