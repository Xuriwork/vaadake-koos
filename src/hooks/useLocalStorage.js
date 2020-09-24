import { useState, useEffect } from 'react';

export const useLocalStorage = (defaultValue, key) => {
    const [value, setValue] = useState(() => {
      const localStorageValue = localStorage.getItem(key);
      return JSON.parse(localStorageValue) ?? defaultValue;
    });

    useEffect(() => {
      localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
};