// CourseModal.js
import React from 'react';

const CourseModal = ({ course, onClose }) => {
  if (!course) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{course.co_title}</h2>
        <p><strong>Subject:</strong> {course.c_subkey}</p>
        <p><strong>Course Number:</strong> {course.c_coursenum}</p>
        <p><strong>Description:</strong> {course.description}</p> {/* You'll need to ensure this data is available */}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default CourseModal;