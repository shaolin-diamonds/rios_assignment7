const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Student = new Schema({
    fname:
    {
        type: String,
        required: true
    },
    lname:
    {
        type: String,
        required: true
    },
    studentID:
    {
        type: String,
        required: true
    },
    dateEntered:
    {
        type: Date,
        required: false
    }
});

mongoose.model('Student', Student);