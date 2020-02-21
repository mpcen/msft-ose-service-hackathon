import React from 'react';
import axios from 'axios';

const useForm = initialState => {
    const [values, setValues] = React.useState(initialState);
    const [filterId, setFilterId] = React.useState(0);
    const [filters, setFilters] = React.useState([]);
    const [isSubmitting, setSubmitting] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [snapshot, setSnapshot] = React.useState(null);
    
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
        fetchData(values);
    }

    const fetchData = async ({ organization, repository, ...rest }) => {
        setSubmitting(true);
        console.log(organization, repository, rest);

        try {
            const response = await axios.get(`${organization}/${repository}/snapshots/1`);
            setSnapshot(response.data);
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
        snapshot,
        error
    }
}

export default useForm;