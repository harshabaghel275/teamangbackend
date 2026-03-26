// const mongoose = require('mongoose');

// const employeeSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   role: {
//     type: String,
//     trim: true,
//     default: 'Employee',
//   },
// }, { timestamps: true });

// module.exports = mongoose.model('Employee', employeeSchema, 'addemployer');



const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    trim: true,
    default: 'Employee',
  },
}, { timestamps: true });

// ✅ Collection name: "addemployer"
module.exports = mongoose.model('Employee', employeeSchema, 'addemployer');