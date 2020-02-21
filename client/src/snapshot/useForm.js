import React from 'react';
import axios from 'axios';

const useForm = initialState => {
    const [values, setValues] = React.useState(initialState);
    const [filterId, setFilterId] = React.useState(0);
    const [filters, setFilters] = React.useState([]);
    const [isSubmitting, setSubmitting] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [snapshots, setSnapshots] = React.useState(null);
    const [metadata, setMetadata] = React.useState([]);
    const [locations, setLocations] = React.useState([]);
    
    const addFilterFormField = () => {
        setFilters(filters => [...filters, { filterId, value: '' }]);
        setFilterId(filterId + 1);
    };
    const removeFilterFormField = filterValue => {
        const filterId = filterValue.split(': ')[0];

        setFilters([...filters.filter(filter => filter.value !== filterId)])
        setValues(values => {
            delete values[filterId.toLowerCase()];

            return {
                ...values
            }
        })
    };

    const handleChange = e => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = e => {
        e.preventDefault();
        setSubmitting(true);
        fetchData(values);
    }

    const fetchData = async ({ organization, repository, ...rest }) => {
        const queryKeys = Object.keys(rest);
        let response, locations = [], metadata = [];

        try {
            if(queryKeys.length) {
                const queryString = queryKeys.map(key => `${key}=${rest[key]}`).join('&');
            
                response = await axios.get(`${organization}/${repository}/snapshots/latest?${queryString}`);
            } else {
                response = await axios.get(`${organization}/${repository}/snapshots/latest`);
            }

            locations = response.data.locations;
            metadata = response.data.metadata;

            setLocations(locations);
            setMetadata(metadata.metadata);
            setSnapshots(response.data);
            setError(false);
        } catch(e) {
            setError(true);
        }

        setSubmitting(false);
    }

    return {
        handleChange,
        handleSubmit,
        values,
        filterId,
        setFilterId,
        filters,
        setFilters,
        addFilterFormField,
        removeFilterFormField,
        isSubmitting,
        snapshots,
        locations,
        metadata,
        error
    }
}

export default useForm;