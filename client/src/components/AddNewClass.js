import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SubjectInput from './SubjectInput';

const AddNewClass = () => {
    const navigate = useNavigate();
    const [newClass, setNewClass] = useState({
        c_semester: '',
        c_year: '',
        c_subkey: '',
        c_coursenum: '',
        c_section: '',
        c_instr: '',
        c_hours: '',
        c_remseats: '',
        c_totseats: '',
        c_remwl: '',
        c_totalwl: ''
    });

    const handleChange = (e) => {
        setNewClass({ ...newClass, [e.target.name]: e.target.value });
    };

    const handleSubjectChange = (subkey) => {
        setNewClass({ ...newClass, c_subkey: subkey });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/classes', newClass);
            alert('Class added successfully');
            navigate('/'); // or to the class list page
        } catch (error) {
            console.error('Error adding class:', error);
            alert('Failed to add class');
        }
    };

    return (
        <div className="add-class-page">
            <h1>Add New Class</h1>
            <form onSubmit={handleSubmit}>
                {/* Form elements */}
                <div className="form-group">
                <select 
                    name="c_semester" 
                    value={newClass.c_semester} 
                    onChange={handleChange}
                    className="form-control"
                >
                    <option value="">Select Term</option>
                    <option value="Fall">Fall</option>
                    <option value="Spring">Spring</option>
                    <option value="Summer">Summer</option>
                </select>
                </div>
                <div className="form-group">
                    <input 
                        type="number" 
                        name="c_year" 
                        value={newClass.c_year} 
                        onChange={handleChange} 
                        placeholder="Year"
                        required 
                    />
                </div>
                <div className="form-group">
                    <SubjectInput 
                        value={newClass.c_subkey} 
                        onChange={(e) => handleSubjectChange(e.target.value)} 
                        placeholder="Subject Key"
                        required 
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        name="c_coursenum" 
                        value={newClass.c_coursenum} 
                        onChange={handleChange} 
                        placeholder="Course Number"
                        required 
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        name="c_section" 
                        value={newClass.c_section} 
                        onChange={handleChange} 
                        placeholder="Section Number"
                        required 
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        name="c_instr" 
                        value={newClass.c_instr}
                        onChange={handleChange}
                        placeholder="Instructor"
                        required
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="number" 
                        name="c_hours" 
                        value={newClass.c_hours} 
                        onChange={handleChange} 
                        placeholder="Hours"
                        required 
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="number" 
                        name="c_remseats" 
                        value={newClass.c_remseats} 
                        onChange={handleChange} 
                        placeholder="Remaining Seats"
                        required 
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="number" 
                        name="c_totseats" 
                        value={newClass.c_totseats} 
                        onChange={handleChange} 
                        placeholder="Total Seats"
                        required 
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="number" 
                        name="c_remwl" 
                        value={newClass.c_remwl} 
                        onChange={handleChange} 
                        placeholder="Remaining Waitlist"
                        required 
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="number" 
                        name="c_totalwl" 
                        value={newClass.c_totalwl} 
                        onChange={handleChange} 
                        placeholder="Total Waitlist"
                        required
                    />
                </div>
                <button type="submit">Add Class</button>
            </form>
        </div>
    );
};

export default AddNewClass;
