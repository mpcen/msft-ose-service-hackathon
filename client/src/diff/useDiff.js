import React from 'react';
import axios from 'axios';

const useForm = initialState => {
    const [values, setValues] = React.useState(initialState);
    const [filterId, setFilterId] = React.useState(0);
    const [filters, setFilters] = React.useState([{ filterId: 0, value: '' }]);
    const [isSubmitting, setSubmitting] = React.useState(false);
    const [error, setError] = React.useState(0);
    const [snapshots, setSnapshots] = React.useState(null);
    const [metadataLHS, setMetadataLHS] = React.useState([]);
    const [metadataRHS, setMetadataRHS] = React.useState([]);
    const [locationsLHS, setLocationsLHS] = React.useState([]);
    const [locationsRHS, setLocationsRHS] = React.useState([]);
    
    const addFilterFormField = () => {
        setFilters(filters => [...filters, { filterId, value: '' }]);
        setFilterId(filterId + 1);
    };
    const removeFilterFormField = () => {
        setFilters([])
        setValues(values => {

            return {
                ...values,
                lhs: '',
                rhs: ''
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
        let responses, locationsLHS = [], metadataLHS = [], locationsRHS = [], metadataRHS = [];
        const isProd = process.env.NODE_ENV === 'production' ? true : false;

        try {
            if(queryKeys.length) {
                const filter = filters[0].value.toLowerCase();
                const queryString = queryKeys.map(key => `${key}=${rest[key]}`).join('&');
                const lhsQueryString = `${filter}=${queryString.split('&')[0].split('=')[1]}`;
                const rhsQueryString = `${filter}=${queryString.split('&')[1].split('=')[1]}`;
                
                responses = await Promise.all([
                    axios.get(`${isProd ? "https://cghackathon-server.azurewebsites.net/":""}${organization}/${repository}/snapshots/latest?${lhsQueryString}`),
                    axios.get(`${isProd ? "https://cghackathon-server.azurewebsites.net/":""}${organization}/${repository}/snapshots/latest?${rhsQueryString}`)
                ]);
                
            } else { // should never hit but yolo
                responses = await Promise.all([
                    axios.get(`${isProd ? "https://cghackathon-server.azurewebsites.net/":""}${organization}/${repository}/snapshots/latest`),
                    axios.get(`${isProd ? "https://cghackathon-server.azurewebsites.net/":""}${organization}/${repository}/snapshots/latest`)
                ]);
            }

            locationsLHS = responses[0].data.locations;
            metadataLHS = responses[0].data.metadata;
            locationsRHS = responses[1].data.locations;
            metadataRHS = responses[1].data.metadata;

            console.log('responses:', responses);
            setLocationsLHS(locationsLHS);
            setMetadataLHS(metadataLHS.metadata);
            setLocationsRHS(locationsRHS);
            setMetadataRHS(metadataRHS.metadata);
            setSnapshots(responses[0].data);

            setError(0);
        } catch(e) {
            setLocationsLHS([]);
            setMetadataLHS([]);
            setLocationsRHS([]);
            setMetadataRHS([]);
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
        locationsLHS,
        metadataLHS,
        locationsRHS,
        metadataRHS,
        error
    }
}

export default useForm;