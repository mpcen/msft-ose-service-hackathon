import React from 'react';
import { Form, Button, Label } from 'semantic-ui-react';

import SnapshotFormField from '../snapshot/SnapshotFormField';

const FilterForm = ({ filter, setFilter, values, handleChange, handleSubmit, setFilters, filters, removeFilterFormField, isSubmitting, error }) => {
    return (
        <Form className="snapshot-form" onSubmit={handleSubmit}>
            <Form.Field required>
                <label>Owner</label>
                <input
                    required
                    name="organization"
                    placeholder='Owner'
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
                {filters.length > 0 && <h2>Filter</h2>}
                {filters.map(filter => (
                    <div style={{ display: 'flex' }}>
                        <SnapshotFormField
                            key={filter.filterId}
                            filter={filter}
                            setFilters={setFilters}
                            currentFilters={filters}
                            removeFilterFormField={removeFilterFormField}
                            values={values}
                            handleChange={handleChange}
                            isDiff
                        />
                    </div>
                ))}
            </div>

            <Button
                color="blue"
                type="submit"
                loading={isSubmitting}
            >
                Submit
            </Button>

            {
                error !== 0 && ((error === 404 &&
                <Label basic color="red">
                    No snapshots were found matching these filters
                </Label>)
                || (error !== 404 &&
                <Label basic pointing="left" color="red">
                    Something went wrong, statuscode: {error}
                </Label>))

            }
        </Form>
    );
}

export default FilterForm;