import { useState, useEffect } from 'react';
import axios from 'axios';

const useRequest = (url, method, options) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        console.log(method, url);
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios[method](url, options);
                setData(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url, options]);

    return { data, loading, error };
};

export default useRequest;
