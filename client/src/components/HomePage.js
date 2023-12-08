// src/components/HomePage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [term, setTerm] = useState('');
    const [year, setYear] = useState('');
    const navigate = useNavigate();

    const handleProceed = () => {
        if (term && year) {
            navigate(`/classes/${term}/${year}`);
        } else {
            alert('Please select both term and year');
        }
    };

    return (
        <div className="page-container">
            <h1>Welcome</h1>
            <div className="form-group">
                <select value={term} onChange={e => setTerm(e.target.value)} className="form-control">
                    <option value="">Select Term</option>
                    <option value="Fall">Fall</option>
                    <option value="Spring">Spring</option>
                    <option value="Summer">Summer</option>
                </select>
            </div>
            <div className="form-group">
                <input 
                    type="number" 
                    value={year} 
                    onChange={e => setYear(e.target.value)} 
                    placeholder="Year (e.g., 2022)" 
                    min="2000" 
                    max="2099"
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <button onClick={handleProceed}>Proceed</button>
            </div>
        </div>
    );
};

export default HomePage;