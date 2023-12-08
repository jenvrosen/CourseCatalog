import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import ClassList from './components/ClassList';
import AddNewClass from './components/AddNewClass';
import UpdateClass from './components/UpdateClass';

const App = () => {
    return (
        <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/classes/:term/:year" element={<ClassList />} />
              <Route path="/add-new-class" element={<AddNewClass />} />
              <Route path="/update-class/:crn" element={<UpdateClass />} />
            </Routes>
        </Router>
    );
};

export default App;