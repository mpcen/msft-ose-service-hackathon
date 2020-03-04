import React from 'react';
import axios from 'axios';

const useForm = initialState => {
    const [values, setValues] = React.useState(initialState);
    const [filterId, setFilterId] = React.useState(0);
    const [filters, setFilters] = React.useState([]);
    const [isSubmitting, setSubmitting] = React.useState(false);
    const [error, setError] = React.useState(0);
    const [snapshots, setSnapshots] = React.useState(null);
    const [metadata, setMetadata] = React.useState([]);
    const [locations, setLocations] = React.useState([]);
    const [alerts, setAlerts] = React.useState(null);
    
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
        let response, alertResponse, locations = [], metadata = [], alerts = null;
        const isProd = process.env.NODE_ENV === 'production' ? true : false;
        try {
            if(queryKeys.length) {
                const queryString = queryKeys.map(key => `${key}=${rest[key]}`).join('&');
            
                response = await axios.get(`${isProd ? "https://cghackathon-server.azurewebsites.net/":""}${organization}/${repository}/snapshots/latest?${queryString}`);
                alertResponse = await axios.get(`${isProd ? "https://cghackathon-server.azurewebsites.net/":""}${organization}/${repository}/alerts/latest?${queryString}`);
            } else {
                response = await axios.get(`${isProd ? "https://cghackathon-server.azurewebsites.net/":""}${organization}/${repository}/snapshots/latest`);
                alertResponse = await axios.get(`${isProd ? "https://cghackathon-server.azurewebsites.net/":""}${organization}/${repository}/alerts/latest`);
            }

            locations = response.data.locations;
            metadata = response.data.metadata;
            alerts = alertResponse.data;

            setLocations(locations);
            setMetadata(metadata.metadata);
            setAlerts(alerts);
            setSnapshots(response.data);
            setError(0);
        } catch(e) {
            setLocations([]);
            setMetadata([]);
            setSnapshots([]);
            setError((e.response || 500) && e.response.status);
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
        alerts,
        error
    }
}

export default useForm;