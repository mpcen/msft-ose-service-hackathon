import React from 'react';
import axios from 'axios';

const useForm = initialState => {
    const [values, setValues] = React.useState(initialState);
    const [filterId, setFilterId] = React.useState(0);
    const [filters, setFilters] = React.useState([]);
    const [isSubmitting, setSubmitting] = React.useState(false);
    
    const addFilterFormField = () => {
        setFilters(filters => [...filters, { filterId, value: '' }]);
        setFilterId(filterId + 1);
    };
    const removeFilterFormField = filterValue => {
        setFilters([...filters.filter(filter => filter.value !== filterValue)])
        
        setValues(values => {
            delete values[filterValue.toLowerCase()];

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
        console.log(organization, repository, rest);

        const response = await axios.get(`${organization}/${repository}/snapshots/12345`);

        console.log(response.data);

        setSubmitting(false);

        // need to implement the rest of this...
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
        isSubmitting
    }
}

export default useForm;