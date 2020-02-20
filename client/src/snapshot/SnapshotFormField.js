import React, { useState } from 'react';
import { Form, Dropdown } from 'semantic-ui-react';

import './snapshotFormField.css';

const options = [
    {
        key: 'Branch',
        text: 'Branch',
        value: 'Branch'
    },
    {
        key: 'Commit',
        text: 'Commit',
        value: 'Commit'
    },
    {
        key: 'Release',
        text: 'Release',
        value: 'Release'
    },
    {
        key: 'Workflow',
        text: 'Workflow',
        value: 'Workflow'
    },
    {
        key: 'Run',
        text: 'Run',
        value: 'Run'
    },
    {
        key: 'OS',
        text: 'OS',
        value: 'OS'
    },
]

const SnapshotFormField = ({ filter, setFilters, currentFilters }) => {
    const [inputValue, setInputValue] = useState('')

    return (
        <Form.Field>
            <div className="form-field-container">
                <div className="form-field-dropdown-container">
                    <Dropdown
                        selection
                        placeholder="Select a filter"
                        text={filter.value}
                        options={options.filter(option => currentFilters.find(currentFilter => currentFilter.value === option.value) ? false : true)}
                        onChange={(_, { value }) => {
                            const subject = currentFilters.find(currentFilter => currentFilter.filterId === filter.filterId);
                            subject.value = value;
                            setFilters(() => [...currentFilters]);
                        }}
                    />
                </div>
                <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            </div>
        </Form.Field>
    );
}

export default SnapshotFormField;