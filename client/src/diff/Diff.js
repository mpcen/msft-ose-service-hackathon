import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

import useDiff from './useDiff';
import DiffViewer from './DiffViewer';
 import FilterForm from './FilterForm'

import './diff.css';

const INITIAL_STATE = {
    organization: 'orgname',
    repository: 'reponame',
    lhs: '',
    rhs: ''
}

const Diff = () => {
    const { values, handleChange, handleSubmit, filters, setFilters, addFilterFormField, removeFilterFormField, isSubmitting, error, locationsLHS, metadataLHS, locationsRHS, metadataRHS } = useDiff(INITIAL_STATE);

    return (
        <div style={{ height: '100%', margin: '24px 20%' }}>
            <h1 style={{ fontWeight: '200' }}>Diff Snapshots</h1>

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
            </div>

            <FilterForm
                values={values}
                filters={filters}
                isSubmitting={isSubmitting}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                removeFilterFormField={removeFilterFormField}
                setFilters={setFilters}
                error={error}
            />

            {
                locationsLHS && locationsLHS.length > 0 && metadataLHS && metadataLHS.length > 0 &&
                <DiffViewer
                    locationsLHS={locationsLHS}
                    metadataLHS={metadataLHS}
                    locationsRHS={locationsRHS}
                    metadataRHS={metadataRHS}
                />
            }
        </div>
    );
}

export default Diff;