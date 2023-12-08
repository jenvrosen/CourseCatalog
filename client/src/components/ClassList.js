import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import SubjectInput from './SubjectInput';
import CourseModal from './CourseModal';

const ClassList = () => {
    const [classes, setClasses] = useState([]);
    const { term, year } = useParams();
    const [filters, setFilters] = useState({
        c_crn: '',
        c_subkey: '',
        c_coursenum: '',
        c_section: '',
        c_instr: '',
        c_hours: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/classes/${term}/${year}`, { params: filters });
                setClasses(response.data);
            } catch (error) {
                console.error(error);
                // Handle error
            }
        };
    
        fetchClasses();
    }, [term, year, filters]);

    const handleFilterChange = (e) => {
        // Directly update the filters state
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleAddClassClick = () => {
        navigate('/add-new-class');
    };

    // State to control the visibility and content of the modal
    const [selectedCourse, setSelectedCourse] = useState(null);

    const handleCourseClick = async (cls) => {
        // Assuming the backend is already sending the `co_title` and `co_desc` in the response
        setSelectedCourse({
            ...cls,
            title: cls.co_title,
            description: cls.co_desc
        });
    };
    

    const handleCloseModal = () => {
        setSelectedCourse(null);
    };

    const handleDelete = async (crn) => {
        if (window.confirm(`Are you sure you want to delete the class with CRN: ${crn}?`)) {
            try {
                const response = await axios.delete(`http://localhost:5000/api/classes/${crn}`);
                if (response.status === 200) {
                    alert('Class deleted successfully');
                    // Refresh the classes list
                    const updatedClasses = classes.filter(cls => cls.c_crn !== crn);
                    setClasses(updatedClasses);
                }
            } catch (error) {
                console.error('Error deleting class:', error);
                alert('Failed to delete class');
            }
        }
    };

    // Function to navigate to update page
    const handleUpdate = (crn) => {
        navigate(`/update-class/${crn}`);
    };

    return (
        <div>
            {/* Filter Inputs */}
            <div className="filter-menu" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input name="c_crn" value={filters.c_crn} onChange={handleFilterChange} placeholder="CRN" />
                <SubjectInput 
                    value={filters.c_subkey} 
                    onChange={handleFilterChange} 
                />
                <input name="c_coursenum" value={filters.c_coursenum} onChange={handleFilterChange} placeholder="Course Number" />
                <input name="c_section" value={filters.c_section} onChange={handleFilterChange} placeholder="Section" />
                <input name="c_instr" value={filters.c_instr} onChange={handleFilterChange} placeholder="Instructor" />
                <input name="c_hours" value={filters.c_hours} onChange={handleFilterChange} placeholder="Credits" />
            </div>

            {/* Back to Home Button */}
            <div className="form-group">
                <button className="submit-button submit-button-wide" onClick={() => navigate('/')}>
                    Back to Home
                </button>
            </div>

            {/* Buttons for Adding New Class */}
            <div className="form-group">
                    <button className="submit-button submit-button-wide" onClick={handleAddClassClick}>
                        Add New Class
                    </button>
            </div>

            {/* Class List */}
            <table>
                <thead>
                    <tr>
                        <th>CRN</th>
                        <th>Subject</th>
                        <th>Course Number</th>
                        <th>Section</th>
                        <th>Title</th>
                        <th>Credits</th>
                        <th>Instructor</th>
                        <th>Seats Open</th>
                    </tr>
                </thead>
                <tbody>
                    {classes.map(cls => (
                        <tr key={cls.c_crn}>
                            <td>{cls.c_crn}</td>
                            <td>{cls.c_subkey}</td>
                            <td>{cls.c_coursenum}</td>
                            <td>{cls.c_section}</td>
                            <td onClick={() => handleCourseClick(cls)} style={{ cursor: 'pointer' }} className="course-title">
                                {cls.co_title}
                            </td>
                            <td>{cls.c_hours}</td>
                            <td>{cls.c_instr}</td>
                            <td>{cls.c_remseats} / {cls.c_totseats}</td>
                            <td>
                                <button style={{ width: '60px', margin: '2px', padding: '5px' }} onClick={() => handleUpdate(cls.c_crn)}>Update</button>
                                <button style={{ width: '60px', margin: '2px', padding: '5px' }} onClick={() => handleDelete(cls.c_crn)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Course Modal */}
            <CourseModal course={selectedCourse} onClose={handleCloseModal} />
        </div>
    );
};

export default ClassList;