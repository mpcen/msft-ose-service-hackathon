import React from 'react';
import { Button, Form, Icon } from 'semantic-ui-react';

import useForm from './useForm';
import SnapshotFormField from './SnapshotFormField';

import './snapshotForm.css';

const INITIAL_STATE = {
    organization: 'orgname',
    repository: 'reponame'
}

const SnapshotForm = () => {
    const { values, handleChange, handleSubmit, filters, setFilters, addFilterFormField, removeFilterFormField, isSubmitting } = useForm(INITIAL_STATE);
    
    return (
        <div>
            <h1>Snapshot</h1>

            <div className="filter-container">
                <div className="filtered">
                    {filters.map(filter => (
                        <div key={filter.filterId} onClick={e => removeFilterFormField(e.currentTarget.innerText)}>
                            <Button
                                style={{ display: filter.value.length ? 'inline' : 'none', zIndex: 0 }}
                                color="green"
                                size="mini"
                            >
                                <Icon name="close" />
                                {filter.value}
                            </Button>
                        </div>
                    ))}
                </div>

                <Button
                    disabled={(filters.length !== 0) && (filters[filters.length - 1].value === '' || filters.length === 6)}
                    onClick={addFilterFormField}
                >
                        Add Filter
                </Button>
            </div>

            <Form className="snapshot-form" onSubmit={handleSubmit}>
                <Form.Field required>
                    <label>Organization</label>
                    <input
                        required
                        name="organization"
                        placeholder='Organization'
                        value={values.organization}
                        onChange={handleChange}
                    />
                </Form.Field>

                <Form.Field required>
                    <label>Repository</label>
                    <input
                        required
                        name="repository"
                        placeholder='Repository'
                        value={values.repository}
                        onChange={handleChange}
                    />
                </Form.Field>

                <div className="filter-field-container">
                    {filters.map(filter => (
                        <SnapshotFormField
                            key={filter.filterId}
                            filter={filter}
                            setFilters={setFilters}
                            currentFilters={filters}
                            removeFilterFormField={removeFilterFormField}
                            values={values}
                            handleChange={handleChange}
                        />
                    ))}
                </div>

                <Button
                    color="blue"
                    type="submit"
                    loading={isSubmitting}
                >
                    Submit
                </Button>
            </Form>
        </div>
    );
}

export default SnapshotForm;