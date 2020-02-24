import React from 'react';
import { Form, Dropdown, Icon } from 'semantic-ui-react';

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

const SnapshotFormField = ({ isDiff, filter, setFilters, currentFilters, removeFilterFormField, values, handleChange }) => {
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

                {
                    isDiff ? (
                        <>
                            <input
                                required
                                className="form-input"
                                name="lhs"
                                value={values.lhs || ''}
                                onChange={handleChange}
                            />
                            <input
                                required
                                className="form-input"
                                name="rhs"
                                value={values.rhs || ''}
                                onChange={handleChange}
                            />
                        </>
                    ) :
                    (
                        <input
                            required
                            className="form-input"
                            name={filter.value.toLowerCase()}
                            value={values[filter.value.toLowerCase()] || ''}
                            onChange={handleChange}
                        />
                    )
                }

                {!isDiff &&
                    <div onClick={() => removeFilterFormField(filter.value)}>
                    <Icon color="red" size="large" name="close" />
                </div>
                }
            </div>
        </Form.Field>
    );
}

export default SnapshotFormField;