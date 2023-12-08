CREATE TABLE class (
    c_semester      varchar(6) not null,
    c_year          decimal(4,0) not null,
    c_crn           decimal(5,0) not null,
    c_subkey        varchar(6) not null, 
    c_coursenum     varchar(4) not null, 
    c_section       varchar(4) not null,
    c_instr         varchar(128),
    c_hours         decimal(1,0) not null,
    c_remseats      decimal(3,0) not null,
    c_totseats      decimal(3,0) not null,
    c_remwl         decimal(3,0),
    c_totalwl       decimal(3,0)
);
CREATE TABLE course (
    co_subkey        varchar(6) not null, 
    co_coursenum     varchar(4) not null, 
    co_title         varchar(100) not null,
    co_desc          varchar(1000)
);
CREATE TABLE requirement (
    r_subkey        varchar(6) not null,
    r_coursenum     varchar(4) not null,
    r_reqtype       varchar(12) not null, -- COREQUISITE or PREREQUISITE
    r_reqsubkey     varchar(6) not null,
    r_reqcoursenum  varchar(4) not null,
    r_reqgrade      varchar(2) not null
);
CREATE TABLE override (
    o_subkey        varchar(6) not null,
    o_coursenum     varchar(4) not null,
    o_minscore      decimal(1,0) not null,
    o_type          varchar(3) not null,       -- AP, IBH
    o_title         varchar(100) not null,
    o_hours         decimal(1,1)
);
CREATE TABLE subject (
    s_subkey        varchar(6) not null,
    s_name          varchar(50) not null
);
CREATE TABLE meetings (
    m_crn           decimal(5,0) not null,
    m_days          varchar(7),             -- U = Sun, M = Mon, T = Tues, W = Wed, R = Thurs, F = Fri, S = Sat
    m_type          varchar(10) not null,   -- LECTURE, DISCUSSION, LAB, EXAM
    m_buildkey      varchar(6),
    m_room          decimal(3,0),
    m_stime         time,
    m_etime         time,  
    m_sdate         date not null,
    m_edate         date not null
);
CREATE TABLE building (
    b_buildkey      varchar(6) not null,
    b_name          varchar(50) not null
);