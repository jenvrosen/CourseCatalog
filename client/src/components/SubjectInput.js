import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SubjectInput = ({ value, onChange }) => {
    const [displayValue, setDisplayValue] = useState(value);
    const [suggestions, setSuggestions] = useState([]);
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        // Fetch subjects from the server
        axios.get('http://localhost:5000/api/subjects')
            .then(response => {
                setSubjects(response.data);
            })
            .catch(error => console.error('Error fetching subjects', error));
    }, []);

    useEffect(() => {
        setDisplayValue(value);
    }, [value]);

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setDisplayValue(inputValue);
        onChange({ target: { name: 'c_subkey', value: inputValue } });

        const filteredSuggestions = inputValue.length > 0 
            ? subjects.filter(subject => 
                  subject.key.toLowerCase().includes(inputValue.toLowerCase()) ||
                  subject.name.toLowerCase().includes(inputValue.toLowerCase()))
            : [];
        setSuggestions(filteredSuggestions);
    };

    const handleSuggestionClick = (suggestionKey) => {
        setDisplayValue(suggestionKey);
        onChange({ target: { name: 'c_subkey', value: suggestionKey } });
        setSuggestions([]);
    };

    return (
        <div style={{ position: 'relative' }}>
            <input 
                type="text" 
                value={displayValue}
                onChange={handleInputChange}
                placeholder="Subject Key or Name"
            />
            {suggestions.length > 0 && (
                <ul style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    zIndex: 100,
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    listStyleType: 'none',
                    padding: 0,
                    margin: 0
                }}>
                    {suggestions.map(suggestion => (
                        <li key={suggestion.key} onClick={() => handleSuggestionClick(suggestion.key)}
                            style={{ padding: '10px', cursor: 'pointer' }}>
                            {suggestion.key} - {suggestion.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SubjectInput;
