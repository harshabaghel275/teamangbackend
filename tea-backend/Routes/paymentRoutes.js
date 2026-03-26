const express  = require('express');
const router   = express.Router();
const Payment  = require('../models/payment');
 
// ── GET /api/payments
// ── Sab payments return karo (history ke liye)
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
// ── GET /api/payments/:month
// ── Ek specific month ka payment status
// ── Example: GET /api/payments/March%202025
router.get('/:month', async (req, res) => {
  try {
    const monthLabel = decodeURIComponent(req.params.month);
    const payment = await Payment.findOne({ month: monthLabel });
    if (!payment) {
      // Payment record nahi mila → pending status return karo
      return res.json({ month: monthLabel, paid: false });
    }
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
// ── POST /api/payments
// ── Naya payment record banao ya update karo (upsert)
// ── Body: { month, paid, paidDate, paidTime, method, amount, note }
router.post('/', async (req, res) => {
  try {
    const { month, paid, paidDate, paidTime, method, amount, note } = req.body;
 
    if (!month) {
      return res.status(400).json({ error: 'month field required hai' });
    }
 
    // Upsert: agar already hai to update karo, nahi hai to create karo
    const payment = await Payment.findOneAndUpdate(
      { month },
      {
        $set: {
          paid:     paid ?? false,
          paidDate: paidDate || null,
          paidTime: paidTime || null,
          method:   method   || null,
          amount:   amount   || null,
          note:     note     || '',
        },
      },
      {
        new:    true,  // updated document return karo
        upsert: true,  // nahi mila to create karo
        setDefaultsOnInsert: true,
      }
    );
 
    res.json({ success: true, payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
// ── PATCH /api/payments/:month/unpay
// ── Payment ko wapas unpaid mark karo (undo)
router.patch('/:month/unpay', async (req, res) => {
  try {
    const monthLabel = decodeURIComponent(req.params.month);
    const payment = await Payment.findOneAndUpdate(
      { month: monthLabel },
      {
        $set: {
          paid:     false,
          paidDate: null,
          paidTime: null,
          method:   null,
          amount:   null,
          note:     '',
        },
      },
      { new: true }
    );
    if (!payment) {
      return res.status(404).json({ error: 'Payment record nahi mila' });
    }
    res.json({ success: true, payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
// ── DELETE /api/payments/:month
// ── Payment record delete karo
router.delete('/:month', async (req, res) => {
  try {
    const monthLabel = decodeURIComponent(req.params.month);
    await Payment.findOneAndDelete({ month: monthLabel });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
module.exports = router;