const express = require('express');
const app = express();
const nodemon = require('nodemon');
app.use(express.json());

//MongoDB Package
const mongoose = require('mongoose');

const PORT = 1200;
let today = new Date().toLocaleDateString()

const dbUrl = "mongodb+srv://dbadmin:admin@mongo.zjgsurz.mongodb.net/test";

//Connect to MongoDB
mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
});

//MongoDB Connection
const db = mongoose.connection;

//Handle DB Error, display connection
db.on('error', () => (
    console.error.bind(console, 'connection error: ')
));
db.once('open', () => {
    console.log('MongoDB Connected');
});

//Schema/Model Declaration
require('./Models/Students');
require('./Models/Courses');

const Student = mongoose.model('Student');
const Course = mongoose.model('Course');

app.get('/', (req,res) => {
    return res.status(200).json("{message: OK}")
});

app.get('/getAllCourses', async (req,res) => {
    try {
        let programs = await Course.find({}).lean();
        return res.status(200).json(programs);
    }
    catch {
        return res.status(500).json("{message: Failed to access course data}");
    }
});

app.get('/getAllStudents', async (req,res) => {
    try {
        let learners = await Student.find({}).lean();
        return res.status(200).json(learners);
    }
    catch {
        return res.status(500).json("{message: Failed to access student data}");
    }
});

app.get('/findStudent', async (req,res) => {
    try {
        let learners = await Student.find({fname: req.body.fname}).lean();
        return res.status(200).json(learners);
    }
    catch {
        return res.status(500).json("{message: Unable to find}");
    }
});

app.get('/findCourse', async (req,res) => {
    try {
        let programs = await Course.find({courseID: req.body.courseID}).lean();
        return res.status(200).json(programs);
    }
    catch {
        return res.status(500).json("{message: Unable to find}");
    }
});

app.post('/addCourse', async (req,res) => {
    try {
        let program = {
            courseInstructor: req.body.courseInstructor,
            courseCredits: req.body.courseCredits,
            courseID: req.body.courseID,
            courseName: req.body.courseName,
            dateEntered: new Date()
        }

        await Course(program).save().then(c => {
            return res.status(201).json("Course Added!");
        })
    }
    catch {
        return res.status(500).json("{message: Failed to add course - bad data}");
    }
});

app.post('/addStudent', async (req,res) => {
    try {
        let learner = {
            fname: req.body.fname,
            lname: req.body.lname,
            studentID: req.body.studentID,
            dateEntered: new Date()
        }

        await Student(learner).save().then(c => {
            return res.status(201).json("Student Added!");
        })
    }
    catch {
        return res.status(500).json("{message: Failed to add student - bad data}");
    }
});

app.post('/editStudentById', async (req,res) =>{
    try {
        leaner = await Student.updateOne({_id: req.body.studentId}
        , {
            studentID: req.body.studentID
        }, {upsert: true});
        if (leaner)
        {
            res.status(200).json("{message: Student ID Edited}");
        }
        else {
            res.status(200).json("{message: Student ID not Changed}");
        }
    }
    catch {
        return res.status(500).json("{message: Failed to Edit Student ID}");
    }
});

app.post('/editStudentByFname', async (req,res) =>{
    try {
        leaner = await Student.updateOne({_id: req.body.fname}
        , {
            fname: req.body.fname
        }, {upsert: true});
        if (leaner)
        {
            res.status(200).json("{message: Student First Name Edited}");
        }
        else {
            res.status(200).json("{message: Student First Name not Changed}");
        }
    }
    catch {
        return res.status(500).json("{message: Failed to Edit Student First Name}");
    }
});

app.post('/editCourseByCourseName', async (req,res) =>{
    try {
        program = await Course.updateOne({_id: req.body.courseName}
        , {
            courseName: req.body.courseName
        }, {upsert: true});
        if (program)
        {
            res.status(200).json("{message: Course Name Edited}");
        }
        else {
            res.status(200).json("{message: Course Name not Changed}");
        }
    }
    catch {
        return res.status(500).json("{message: Failed to Edit Course Name}");
    }
});

app.post('/deleteCourseById', async (req,res) => {
	try {
		let program = await Course.findOne({_id: req.body.courseID});

		if(program) {
			await Crypto.deleteOne({_id: req.body.courseID});
            return res.status(200).json("{message: Course deleted}");
		}
		else {
			return res.status(200).json("{message: Course not deleted - query null}");
		}
	}
	catch {
		return res.status(500).json("{message: Failed to Delete Course}");
	}
});

app.post('/removeStudentFromClasses', async (req,res) => {
	try {
		let leaner = await Student.findOne({_id: req.body.studentId});

		if(leaner) {
			await Student.deleteOne({_id: req.body.studentId});
            return res.status(200).json("{message: Student removed}");
		}
		else {
			return res.status(200).json("{message: Student not removed - query null}");
		}
	}
	catch {
		return res.status(500).json("{message: Failed to remove Student}");
	}
});

app.listen(PORT, () => {
    console.log(`Server Started on port ${PORT}`);
});