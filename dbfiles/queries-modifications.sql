.headers ON

-- Add course
INSERT INTO course (co_subkey, co_coursenum, co_title, co_desc)
VALUES('CSE', '108', 'Software Engineering', 'Teams work on approved design projects or on software teams. Through these projects, students will practice design methodology and learn modern software engineering techniques to create reliable, efficient, reusable, and maintainable software systems using various design process models. Good standard project practices topics will be covered.');

-- Update course
UPDATE course SET co_coursenum = '120';

-- Delete course
DELETE FROM course
WHERE 
    co_subkey = 'CSE'
    AND co_coursenum = '120';

-- Select classes linked to CRN 10161
SELECT
    c_subkey AS subject,
    c_coursenum AS coursenum,
    c_section AS section
FROM class
WHERE 
    c_subkey = (SELECT c_subkey FROM class WHERE c_crn = 10161)
    AND c_coursenum = (SELECT c_coursenum FROM class WHERE c_crn = 10161)
GROUP BY c_section;

-- Select all sections for MATH 005
SELECT
    c_subkey AS subject,
    c_coursenum AS coursenum,
    c_section AS section
FROM class
WHERE
    c_subkey = 'MATH'
    AND c_coursenum = '005'
GROUP BY c_section;

-- Select all classes taught by Sindi, Suzanna
SELECT
    c_subkey AS subject,
    c_coursenum AS coursenum,
    c_section AS section,
    c_instr AS instructor
FROM class
WHERE
    c_instr = 'Sindi, Suzanne'
GROUP BY c_coursenum, c_section;

-- Select all classes with no open seats
SELECT
    c_subkey AS subject,
    c_coursenum AS coursenum,
    c_section AS section,
    c_instr AS instructor,
    c_remseats AS openseats,
    c_totseats AS seats
FROM class
WHERE
    c_remseats <= 0
GROUP BY c_coursenum, c_section;

-- Select all classes that have open seats and are in COB 1
SELECT
    c_subkey AS subject,
    c_coursenum AS coursenum,
    c_section AS section,
    b_name AS building,
    c_remseats AS openseats,
    c_totseats AS seats
FROM class
JOIN meetings ON c_crn = m_crn
JOIN building ON m_buildkey = b_buildkey
WHERE
    m_buildkey = 'COB1'
    AND c_remseats > 0
GROUP BY c_coursenum, c_section;

-- Select all discussion sections for MATH 005 that are in COB1 263
SELECT
    c_subkey AS subject,
    c_coursenum AS coursenum,
    c_section AS section,
    b_name AS building,
    m_room AS room
FROM class
JOIN meetings ON c_crn = m_crn
JOIN building ON m_buildkey = b_buildkey
WHERE
    c_subkey = 'MATH'
    AND c_coursenum = '005'
    AND m_type = 'DISCUSSION'
    AND m_buildkey = 'COB1'
    AND m_room = 263
GROUP BY c_coursenum, c_section;

-- Select all discussion sections for MATH 011-20
SELECT
    c_subkey AS subject,
    c_coursenum AS coursenum,
    c_section AS section
FROM class
WHERE
    c_subkey = 'MATH'
    AND c_coursenum = '011'
    AND c_section LIKE '2_D'
GROUP BY c_section;

-- Select all classes that have a meeting in COB1 or COB2
SELECT
    c_subkey AS subject,
    c_coursenum AS coursenum,
    c_section AS section,
    b_name AS building
FROM class
JOIN meetings ON c_crn = m_crn
JOIN building ON m_buildkey = b_buildkey
WHERE
    m_buildkey = 'COB1'
    OR m_buildkey = 'COB2'
GROUP BY c_coursenum, c_section;

-- Count all lecture sections
SELECT COUNT(*) AS numclasses FROM class;

-- Select all classes that have open spots in the waitlist and have an override
SELECT
    c_subkey AS subject,
    c_coursenum AS coursenum,
    c_section AS section,
    c_remwl AS openwaitlist,
    c_totalwl AS waitlist
FROM class
WHERE
    (SELECT COUNT(*) FROM override WHERE o_subkey = c_subkey AND o_coursenum = c_coursenum) > 0
    AND c_remwl > 0
    AND c_remwl IS NOT 'NULL'
GROUP BY c_coursenum, c_section;

-- Select all overrides for MATH 021
SELECT
    o_subkey AS subject,
    o_coursenum AS coursenum,
    o_minscore AS minscore,
    o_type AS type,
    o_title AS title,
    o_hours AS hours
FROM override
WHERE
    o_subkey = 'MATH'
    AND o_coursenum = '021'
GROUP BY o_type, o_minscore, o_title;

-- Select all classes with prerequisites
SELECT
    c_subkey AS subject,
    c_coursenum AS coursenum
FROM class
WHERE
    (SELECT COUNT(*) FROM requirement WHERE r_subkey = c_subkey AND r_coursenum = c_coursenum AND r_reqtype = 'PREREQUISITE') > 0
GROUP BY c_coursenum, c_section;

-- Select all classes with a MATH 005 prerequisite
SELECT
    r_subkey AS subject,
    r_coursenum AS coursenum
FROM requirement
WHERE
    r_reqsubkey = 'MATH'
    AND r_reqcoursenum = '005'
GROUP BY r_subkey, r_coursenum;

-- Select all overrides for MATH 011
SELECT *
FROM override
WHERE
    o_subkey = 'MATH'
    AND o_coursenum = '011'
GROUP BY o_type, o_minscore, o_title;

-- Select all classes in the SPRING 2024 semester
SELECT *
FROM class
WHERE
    c_semester = 'SPRING'
    AND c_year = 2024
GROUP BY c_subkey, c_coursenum, c_section;

-- Select all corequisites for MATH 021 (Should be empty)
SELECT
    r_subkey AS subject,
    r_coursenum AS coursenum
FROM requirement
WHERE
    r_subkey = 'MATH'
    AND r_coursenum = '021'
    AND r_reqtype = 'COREQUISITE'
GROUP BY r_subkey, r_coursenum;

-- Select all MATH classes taught by 'Hambley, David' that have exactly 39 seats remaning and are in COB1
SELECT
    c_subkey AS subject,
    c_coursenum AS coursenum,
    c_section AS section,
    c_instr AS instructor,
    c_remseats AS openseats,
    b_name AS building
FROM class
JOIN meetings ON c_crn = m_crn
JOIN building ON m_buildkey = b_buildkey
WHERE
    c_subkey = 'MATH'
    AND c_instr = 'Hambley, David'
    AND c_remseats = 39
    AND b_buildkey = 'COB1';

-- Select all classes that meet on Wednesday
SELECT
    c_subkey AS subject,
    c_coursenum AS coursenum,
    c_section AS section,
    m_days AS meetingdays
FROM class
JOIN meetings ON c_crn = m_crn
WHERE m_days LIKE '%W%';