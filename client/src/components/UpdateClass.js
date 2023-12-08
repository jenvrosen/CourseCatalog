import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import SubjectInput from './SubjectInput';

const UpdateClass = () => {
    const { crn } = useParams();
    const navigate = useNavigate();
    const [classData, setClassData] = useState({
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

    useEffect(() => {
        axios.get(`http://localhost:5000/api/class/${crn}`)
            .then(response => {
                if (response.data) {
                    setClassData(response.data);
                } else {
                    console.error('Class data not found');
                }
            })
            .catch(error => console.error('Error fetching class data', error));
    }, [crn]);

    const handleChange = (e) => {
        setClassData({ ...classData, [e.target.name]: e.target.value });
    };

    const handleSubjectChange = (value) => {
        setClassData({ ...classData, c_subkey: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedFields = Object.fromEntries(
            Object.entries(classData).filter(([key, value]) => value !== '')
        );
    
        if (Object.keys(updatedFields).length === 0) {
            alert('No changes made to update.');
            return;
        }
    
        try {
            await axios.put(`http://localhost:5000/api/classes/${crn}`, updatedFields);
            alert('Class updated successfully');
            if (classData.c_semester && classData.c_year) {
                navigate(`/classes/${classData.c_semester}/${classData.c_year}`, { state: { updated: true } });
            } else {
                console.error('Semester or year data is missing');
            }
        } catch (error) {
            console.error('Error updating class:', error);
            alert('Failed to update class');
        }
    };

    return (
        <div className="add-class-page">
            <h1>Update Class</h1>
            <form onSubmit={handleSubmit}>
                {/* Repeat your form group structure here, similar to AddNewClass */}
                {/* Example for semester input */}
                <div className="form-group">
                    <select 
                        name="c_semester"
                        value={classData.c_semester}
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
                        value={classData.c_year} 
                        onChange={handleChange} 
                        placeholder="Year"
                        required 
                    />
                </div>
                <div className="form-group">
                    <SubjectInput 
                        value={classData.c_subkey} 
                        onChange={(e) => handleSubjectChange(e.target.value)} 
                        placeholder="Subject Key"
                        required 
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        name="c_coursenum" 
                        value={classData.c_coursenum} 
                        onChange={handleChange} 
                        placeholder="Course Number"
                        required 
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        name="c_section" 
                        value={classData.c_section} 
                        onChange={handleChange} 
                        placeholder="Section Number"
                        required 
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        name="c_instr" 
                        value={classData.c_instr}
                        onChange={handleChange}
                        placeholder="Instructor"
                        required
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="number" 
                        name="c_hours" 
                        value={classData.c_hours} 
                        onChange={handleChange} 
                        placeholder="Hours"
                        required 
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="number" 
                        name="c_remseats" 
                        value={classData.c_remseats} 
                        onChange={handleChange} 
                        placeholder="Remaining Seats"
                        required 
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="number" 
                        name="c_totseats" 
                        value={classData.c_totseats} 
                        onChange={handleChange} 
                        placeholder="Total Seats"
                        required 
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="number" 
                        name="c_remwl" 
                        value={classData.c_remwl} 
                        onChange={handleChange} 
                        placeholder="Remaining Waitlist"
                        required 
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="number" 
                        name="c_totalwl" 
                        value={classData.c_totalwl} 
                        onChange={handleChange} 
                        placeholder="Total Waitlist"
                        required
                    />
                </div>
                <div className="form-group">
                    <button type="submit" className="submit-button">Update Class</button>
                </div>
            </form>
        </div>
    );
};

export default UpdateClass;