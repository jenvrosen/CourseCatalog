const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(cors());

// SQLite database connection
let db = new sqlite3.Database('./coursecatalog.sqlite', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

// Endpoint: Fetching classes for a semester and term
app.get('/api/classes/:term/:year', (req, res) => {
    const { term, year } = req.params;
    const filters = req.query;

    let sql = `
        SELECT 
            class.*,
            IFNULL(course.co_title, '') AS co_title,
            IFNULL(course.co_desc, '') AS co_desc
        FROM class
        LEFT JOIN course ON class.c_subkey = course.co_subkey AND class.c_coursenum = course.co_coursenum
        WHERE class.c_semester = ? AND class.c_year = ?
    `;
    let params = [term.toUpperCase(), year];

    // Iterate over each filter and append to SQL query and params if present
    Object.keys(filters).forEach(key => {
        if (filters[key]) {
            if (key === 'c_instr') {
                // Use LIKE for partial matching on instructor name
                sql += ` AND class.${key} LIKE ?`;
                params.push(`%${filters[key]}%`);
            } else {
                // For other filters, use direct matching
                sql += ` AND class.${key} = ?`;
                params.push(filters[key]);
            }
        }
    });

    // Append ORDER BY clause here, after all filter conditions
    sql += ' ORDER BY c_subkey, c_coursenum, c_section';

    // Execute the query with the params array
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Endpoint: Fetching subjects
app.get('/api/subjects', (req, res) => {
    const sql = "SELECT s_subkey AS key, s_name AS name FROM subject";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Endpoint: Adding a class
app.post('/api/classes', (req, res) => {
    const newClass = req.body; // Data should include c_semester, c_year, etc.

    // Convert semester to uppercase
    if (newClass.c_semester) {
        newClass.c_semester = newClass.c_semester.toUpperCase();
    }

    // First, find the highest CRN
    db.get("SELECT MAX(c_crn) as maxCrn FROM class", [], (err, row) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        const maxCrn = row.maxCrn ? row.maxCrn + 1 : 1; // Start from 1 if no classes exist

        // Now insert the new class with the next CRN
        const sql = `INSERT INTO class (c_crn, c_semester, c_year, c_subkey, c_coursenum, c_section, c_instr, c_hours, c_remseats, c_totseats, c_remwl, c_totalwl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const params = [maxCrn, newClass.c_semester, newClass.c_year, newClass.c_subkey, newClass.c_coursenum, newClass.c_section, newClass.c_instr, newClass.c_hours, newClass.c_remseats, newClass.c_totseats, newClass.c_remwl, newClass.c_totalwl];
        
        db.run(sql, params, function(err) {
            if (err) {
                console.error("Error adding class:", err.message); // Detailed logging
                res.status(500).send("Error adding class: " + err.message);
                return;
            }
            res.status(201).json({ classId: this.lastID, crn: maxCrn });
        });
    });
});

// Endpoint: Fetching a Class
app.get('/api/class/:crn', (req, res) => {
    const crn = req.params.crn;
    const sql = `SELECT * FROM class WHERE c_crn = ?`;
    db.get(sql, [crn], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(row);
    });
});

// Endpoint: Updating a Class
app.put('/api/classes/:crn', (req, res) => {
    const updates = req.body;
    const crn = req.params.crn;

    // Convert semester to uppercase
    if (updates.c_semester) {
        updates.c_semester = updates.c_semester.toUpperCase();
    }

    // Start building the SQL query and parameters
    let sql = 'UPDATE class SET ';
    let params = [];
    Object.keys(updates).forEach((key, index, array) => {
        sql += `${key} = ?`;
        sql += index < array.length - 1 ? ', ' : ' '; // Add comma between updates, except after last item
        params.push(updates[key]);
    });
    sql += 'WHERE c_crn = ?';
    params.push(crn);

    // Execute the query
    db.run(sql, params, function(err) {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json({ message: 'Class updated successfully', changes: this.changes });
    });
});

// Endpoint: Deleting a Class
app.delete('/api/classes/:crn', (req, res) => {
    const crn = req.params.crn;
    const sql = 'DELETE FROM class WHERE c_crn = ?';
    db.run(sql, crn, function(err) {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json({ message: 'Class deleted successfully', changes: this.changes });
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});