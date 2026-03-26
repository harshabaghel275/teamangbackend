const mongoose = require('mongoose');
 
const PaymentSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: true,
      unique: true,
      // Format: "March 2025", "February 2025", etc.
      trim: true,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    paidDate: {
      type: String, // "2025-03-31" format
      default: null,
    },
    paidTime: {
      type: String, // "11:30 AM"
      default: null,
    },
    method: {
      type: String,
      enum: ['cash', 'online', null],
      default: null,
    },
    amount: {
      type: Number,
      default: null,
    },
    note: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt auto
  }
);
 
module.exports = mongoose.model('Payment', PaymentSchema);