import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

import useForm from './useForm';
import SnapshotViewer from './SnapshotViewer';
import SnapshotForm from './SnapshotForm';

import './snapshot.css';

const INITIAL_STATE = {
    organization: 'owner',
    repository: 'reponame'
}

const Snapshot = () => {
    const { values, handleChange, handleSubmit, filters, setFilters, addFilterFormField, removeFilterFormField, isSubmitting, error, locations, metadata } = useForm(INITIAL_STATE);

    return (
        <div style={{ height: '100%', margin: '24px 20%' }}>
            <h1 style={{ fontWeight: '200' }}>Repository Snapshot</h1>

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
                                {filter.value}: {values[filter.value.toLowerCase()]}
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

            <SnapshotForm
                values={values}
                filters={filters}
                isSubmitting={isSubmitting}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                removeFilterFormField={removeFilterFormField}
                setFilters={setFilters}
                error={error}
            />

            {locations && locations.length > 0 && metadata && metadata.length > 0 && <SnapshotViewer locations={locations} metadata={metadata} />}
        </div>
    );
}

export default Snapshot;