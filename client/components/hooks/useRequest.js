import { useState } from 'react';
import axios from 'axios';

export const useRequest = ({ url, method }) => {
    const [errors, setErrors] = useState(null);
    const doRequest = async () => {
        axios[method](url)
            .then(function (response) {
                console.log(response.data);
                return response.data;
            })
            .catch(function (error) {
                setErrors(error);
            });
    };

    return { errors, doRequest };
};