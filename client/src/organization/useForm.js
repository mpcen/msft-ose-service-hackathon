import React from 'react';
import axios from 'axios';

const useForm = initialState => {
    const [values, setValues] = React.useState(initialState);
    const [data, setData] = React.useState(null);

    const handleSubmit = e => {
        e.preventDefault();
        fetchData(values);
    }

    const handleChange = e => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        });
    }

    const fetchData = async ({ owner, type, name, version }) => {
        const isProd = process.env.NODE_ENV === 'production' ? true : false;
        let response = await axios.post(`${isProd ? "https://cghackathon-server.azurewebsites.net/":""}${owner}/components`,
        {
            type: type,
            name: name,
            version: version
        });

        setData(response.data);
    }

    return {
        handleChange,
        handleSubmit,
        values,
        data
    }
}

export default useForm;