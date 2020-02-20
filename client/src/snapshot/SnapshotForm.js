import React, { useState } from 'react';
import { Button, Form, Icon } from 'semantic-ui-react';

import './snapshotForm.css';
import SnapshotFormField from './SnapshotFormField';

const SnapshotForm = () => {
    const [filterId, setFilterId] = useState(0);
    const [filters, setFilters] = useState([]);
    const [organization, setOrganization] = useState('');
    const [repository, setRepository] = useState('');
    const addFilterFormField = () => {
        setFilters(filters => [...filters, { filterId, value: '' }]);
        setFilterId(filterId + 1);
    };
    const removeFilterFormField = filterValue => setFilters([...filters.filter(filter => filter.value !== filterValue)]);

    return (
        <div>
            <h1>Snapshot</h1>

            <Form className="snapshot-form">
                <Form.Field required>
                    <label>Organization</label>
                    <input placeholder='Organization' value={organization} onChange={e => setOrganization(e.target.value)} />
                </Form.Field>

                <Form.Field required>
                    <label>Repository</label>
                    <input placeholder='Repository' value={repository} onChange={e => setRepository(e.target.value)} />
                </Form.Field>

                <div className="filter-container">
                    {filters.length > 0 && <h2>Filters</h2>}
                    
                    <div>
                        {filters.map(filter => (
                            <Button
                                style={{ display: filter.value.length ? 'inline' : 'none' }}
                                key={filter.filterId}
                                color="blue"
                                size="mini"
                                onClick={(e) => removeFilterFormField(e.target.textContent)}
                            >
                                <Icon name="close" />
                                <span>{filter.value}</span>
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="filter-field-container">
                    {filters.map(filter => (
                        <SnapshotFormField
                            key={filter.filterId}
                            filter={filter}
                            setFilters={setFilters}
                            currentFilters={filters}
                        />
                    ))}
                </div>

                <div>
                    <Button onClick={addFilterFormField}>Add Filter</Button>
                </div>
            </Form>
        </div>
    );
}

export default SnapshotForm;