// // const mongoose = require('mongoose');

// // const teaEntrySchema = new mongoose.Schema({
// //   employeeId: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: 'Employee',
// //     required: true,
// //   },
// //   employeeName: {
// //     type: String,
// //     required: true,
// //   },
// //   cups: {
// //     type: Number,
// //     required: true,
// //     default: 0,
// //   },
// //   pricePerCup: {
// //     type: Number,
// //     default: 5,
// //   },
// //   amount: {
// //     type: Number, // cups * pricePerCup
// //   },
// //   date: {
// //     type: String, // "2025-03-23"
// //     required: true,
// //   },
// //   day: {
// //     type: String, // "Monday"
// //   },
// //   time: {
// //     type: String, // "10:30 AM"
// //   },
// //   month: {
// //     type: String, // "March 2025"
// //   },
// //   perdaytea: {
// //     type: Number, // us din ka total cups (sab employees ka)
// //   },
// //   monthtea: {
// //     type: Number, // us mahine ka total cups
// //   },
// // }, { timestamps: true });

// // module.exports = mongoose.model('TeaEntry', teaEntrySchema, 'teatracker');






// const mongoose = require('mongoose');

// const teaEntrySchema = new mongoose.Schema({
//   employeeId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Employee',
//     required: true,
//   },
//   employeeName: {
//     type: String,
//     required: true,
//   },
//   cups: {
//     type: Number,
//     required: true,
//     default: 0,
//   },
//   pricePerCup: {
//     type: Number,
//     default: 5,
//   },
//   amount: {
//     type: Number,
//   },
//   date: {
//     type: String,   // "2025-03-23"
//     required: true,
//   },
//   day: {
//     type: String,   // "Monday"
//   },
//   time: {
//     type: String,   // "10:30 AM"
//   },
//   month: {
//     type: String,   // "March 2025"
//   },
//   perdaytea: {
//     type: Number,   // us din ka total cups (sab employees ka)
//   },
//   monthtea: {
//     type: Number,   // us mahine ka total cups
//   },
// }, { timestamps: true });

// // ✅ Collection name: "teatracker"
// module.exports = mongoose.model('TeaEntry', teaEntrySchema, 'teatracker');


const mongoose = require('mongoose');

const teaEntrySchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',   // ✅ addemployer collection se reference
    required: true,
  },
  employeeName: {
    type: String,
    required: true,
  },
  cups: {
    type: Number,
    required: true,
    default: 0,
  },
  pricePerCup: {
    type: Number,
    default: 5,
  },
  amount: {
    type: Number,
  },
  date: {
    type: String,   // "2025-03-23"
    required: true,
  },
  day: {
    type: String,   // "Monday"
  },
  time: {
    type: String,   // "10:30 AM"
  },
  month: {
    type: String,   // "March 2025"
  },
  perdaytea: {
    type: Number,   // us din ka total cups
  },
  monthtea: {
    type: Number,   // us mahine ka total cups
  },
}, { timestamps: true });

// ✅ Collection name: "teatracker"
module.exports = mongoose.model('TeaEntry', teaEntrySchema, 'teatracker');