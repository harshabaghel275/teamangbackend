// // // // const express  = require('express');
// // // // const router   = express.Router();
// // // // const TeaEntry = require('../models/TeaEntry');
// // // // const Employee = require('../models/Employee');

// // // // // ─── Helper: Date info ───────────────────────────────────────
// // // // function getDateInfo() {
// // // //   const now   = new Date();
// // // //   const days  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
// // // //   const months= ['January','February','March','April','May','June',
// // // //                  'July','August','September','October','November','December'];

// // // //   const date  = now.toISOString().split('T')[0]; // "2025-03-23"
// // // //   const day   = days[now.getDay()];               // "Sunday"
// // // //   const time  = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
// // // //   const month = `${months[now.getMonth()]} ${now.getFullYear()}`; // "March 2025"

// // // //   return { date, day, time, month };
// // // // }

// // // // // ✅ 1. SAVE TEA ENTRY (ek din ka poora data save)
// // // // // Body: [{ employeeId, cups }]
// // // // router.post('/save', async (req, res) => {
// // // //   try {
// // // //     const { entries } = req.body; // array of { employeeId, cups }

// // // //     if (!entries || !Array.isArray(entries) || entries.length === 0) {
// // // //       return res.status(400).json({ message: 'entries array required' });
// // // //     }

// // // //     const { date, day, time, month } = getDateInfo();
// // // //     const PRICE_PER_CUP = 5;

// // // //     // Us din ka total cups calculate karo
// // // //     const perdaytea = entries.reduce((sum, e) => sum + (e.cups || 0), 0);

// // // //     // Us mahine ka pehle se saved cups
// // // //     const monthlyExisting = await TeaEntry.aggregate([
// // // //       { $match: { month } },
// // // //       { $group: { _id: null, total: { $sum: '$cups' } } },
// // // //     ]);
// // // //     const existingMonthCups = monthlyExisting[0]?.total || 0;
// // // //     const monthtea          = existingMonthCups + perdaytea;

// // // //     // Pehle us din ka data delete karo (re-save ke liye)
// // // //     await TeaEntry.deleteMany({ date });

// // // //     // Har employee ka entry save karo
// // // //     const savedEntries = [];
// // // //     for (const entry of entries) {
// // // //       const emp = await Employee.findById(entry.employeeId);
// // // //       if (!emp) continue;

// // // //       const cups   = entry.cups || 0;
// // // //       const amount = cups * PRICE_PER_CUP;

// // // //       const teaDoc = new TeaEntry({
// // // //         employeeId:   emp._id,
// // // //         employeeName: emp.name,
// // // //         cups,
// // // //         pricePerCup:  PRICE_PER_CUP,
// // // //         amount,
// // // //         date,
// // // //         day,
// // // //         time,
// // // //         month,
// // // //         perdaytea,
// // // //         monthtea,
// // // //       });

// // // //       const saved = await teaDoc.save();
// // // //       savedEntries.push(saved);
// // // //     }

// // // //     return res.status(201).json({
// // // //       message:     'Tea entry saved successfully ✅',
// // // //       date,
// // // //       day,
// // // //       perdaytea,
// // // //       monthtea,
// // // //       totalAmount: perdaytea * PRICE_PER_CUP,
// // // //       data:        savedEntries,
// // // //     });

// // // //   } catch (error) {
// // // //     console.log('❌ Save error:', error.message);
// // // //     return res.status(500).json({ error: error.message });
// // // //   }
// // // // });

// // // // // ✅ 2. GET TODAY'S ENTRIES
// // // // router.get('/today', async (req, res) => {
// // // //   try {
// // // //     const today = new Date().toISOString().split('T')[0];
// // // //     const entries = await TeaEntry.find({ date: today });

// // // //     const totalCups   = entries.reduce((sum, e) => sum + e.cups, 0);
// // // //     const totalAmount = totalCups * 5;

// // // //     return res.status(200).json({
// // // //       date: today,
// // // //       totalCups,
// // // //       totalAmount,
// // // //       entries,
// // // //     });
// // // //   } catch (error) {
// // // //     return res.status(500).json({ error: error.message });
// // // //   }
// // // // });

// // // // // ✅ 3. GET BY DATE
// // // // router.get('/date/:date', async (req, res) => {
// // // //   try {
// // // //     const entries = await TeaEntry.find({ date: req.params.date });

// // // //     const totalCups   = entries.reduce((sum, e) => sum + e.cups, 0);
// // // //     const totalAmount = totalCups * 5;

// // // //     return res.status(200).json({
// // // //       date: req.params.date,
// // // //       totalCups,
// // // //       totalAmount,
// // // //       entries,
// // // //     });
// // // //   } catch (error) {
// // // //     return res.status(500).json({ error: error.message });
// // // //   }
// // // // });

// // // // // ✅ 4. GET BY MONTH
// // // // router.get('/month/:month', async (req, res) => {
// // // //   try {
// // // //     // month param: "March 2025"
// // // //     const month   = decodeURIComponent(req.params.month);
// // // //     const entries = await TeaEntry.find({ month });

// // // //     const totalCups   = entries.reduce((sum, e) => sum + e.cups, 0);
// // // //     const totalAmount = totalCups * 5;

// // // //     // Employee-wise monthly summary
// // // //     const empSummary = {};
// // // //     entries.forEach(e => {
// // // //       if (!empSummary[e.employeeName]) {
// // // //         empSummary[e.employeeName] = { cups: 0, amount: 0 };
// // // //       }
// // // //       empSummary[e.employeeName].cups   += e.cups;
// // // //       empSummary[e.employeeName].amount += e.amount;
// // // //     });

// // // //     return res.status(200).json({
// // // //       month,
// // // //       totalCups,
// // // //       totalAmount,
// // // //       employeeSummary: empSummary,
// // // //       entries,
// // // //     });
// // // //   } catch (error) {
// // // //     return res.status(500).json({ error: error.message });
// // // //   }
// // // // });

// // // // // ✅ 5. GET ALL ENTRIES
// // // // router.get('/', async (req, res) => {
// // // //   try {
// // // //     const entries = await TeaEntry.find().sort({ createdAt: -1 });
// // // //     return res.status(200).json(entries);
// // // //   } catch (error) {
// // // //     return res.status(500).json({ error: error.message });
// // // //   }
// // // // });

// // // // module.exports = router;




// // // const express  = require('express');
// // // const router   = express.Router();
// // // const TeaEntry = require('../models/TeaEntry');
// // // const Employee = require('../models/Employee');

// // // // ─── Helper: Date info ───────────────────────────────────────
// // // function getDateInfo() {
// // //   const now    = new Date();
// // //   const days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
// // //   const months = ['January','February','March','April','May','June',
// // //                   'July','August','September','October','November','December'];

// // //   const date  = now.toISOString().split('T')[0];
// // //   const day   = days[now.getDay()];
// // //   const time  = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
// // //   const month = `${months[now.getMonth()]} ${now.getFullYear()}`;

// // //   return { date, day, time, month };
// // // }

// // // // ✅ 1. SAVE TEA ENTRY — ACCUMULATE (add to existing, don't replace)
// // // // Body: { entries: [{ employeeId, cups }] }
// // // router.post('/save', async (req, res) => {
// // //   try {
// // //     const { entries } = req.body;

// // //     if (!entries || !Array.isArray(entries) || entries.length === 0) {
// // //       return res.status(400).json({ message: 'entries array required' });
// // //     }

// // //     const { date, day, time, month } = getDateInfo();
// // //     const PRICE_PER_CUP = 5;

// // //     const savedEntries = [];

// // //     for (const entry of entries) {
// // //       const emp = await Employee.findById(entry.employeeId);
// // //       if (!emp) continue;

// // //       const newCups   = entry.cups || 0;
// // //       if (newCups <= 0) continue;

// // //       const newAmount = newCups * PRICE_PER_CUP;

// // //       // ── Check: kya aaj ka entry already exist karta hai? ──
// // //       const existing = await TeaEntry.findOne({
// // //         employeeId: emp._id,
// // //         date,
// // //       });

// // //       if (existing) {
// // //         // ✅ ACCUMULATE — cups add karo
// // //         existing.cups   += newCups;
// // //         existing.amount += newAmount;
// // //         existing.time    = time; // last update time
// // //         const updated = await existing.save();
// // //         savedEntries.push(updated);
// // //       } else {
// // //         // ✅ NEW ENTRY — pehli baar
// // //         const teaDoc = new TeaEntry({
// // //           employeeId:   emp._id,
// // //           employeeName: emp.name,
// // //           cups:         newCups,
// // //           pricePerCup:  PRICE_PER_CUP,
// // //           amount:       newAmount,
// // //           date,
// // //           day,
// // //           time,
// // //           month,
// // //           perdaytea: 0, // neeche update hoga
// // //           monthtea:  0,
// // //         });
// // //         const saved = await teaDoc.save();
// // //         savedEntries.push(saved);
// // //       }
// // //     }

// // //     // ── Recalculate perdaytea (aaj ka total) ──────────────────
// // //     const todayEntries = await TeaEntry.find({ date });
// // //     const perdaytea    = todayEntries.reduce((sum, e) => sum + e.cups, 0);

// // //     // ── Recalculate monthtea (is mahine ka total) ─────────────
// // //     const monthEntries = await TeaEntry.find({ month });
// // //     const monthtea     = monthEntries.reduce((sum, e) => sum + e.cups, 0);

// // //     // ── Aaj ke sabhi entries mein updated totals save karo ────
// // //     await TeaEntry.updateMany({ date }, { perdaytea, monthtea });

// // //     return res.status(201).json({
// // //       message:     'Tea entry saved ✅',
// // //       date,
// // //       day,
// // //       perdaytea,
// // //       monthtea,
// // //       totalAmount: perdaytea * PRICE_PER_CUP,
// // //       data:        savedEntries,
// // //     });

// // //   } catch (error) {
// // //     console.error('❌ Save error:', error.message);
// // //     return res.status(500).json({ error: error.message });
// // //   }
// // // });

// // // // ✅ 2. GET TODAY'S ENTRIES (summary ke liye)
// // // router.get('/today', async (req, res) => {
// // //   try {
// // //     const today   = new Date().toISOString().split('T')[0];
// // //     const entries = await TeaEntry.find({ date: today }).sort({ time: 1 });

// // //     const totalCups   = entries.reduce((sum, e) => sum + e.cups, 0);
// // //     const totalAmount = totalCups * 5;

// // //     return res.status(200).json({ date: today, totalCups, totalAmount, entries });
// // //   } catch (error) {
// // //     return res.status(500).json({ error: error.message });
// // //   }
// // // });

// // // // ✅ 3. GET BY DATE
// // // router.get('/date/:date', async (req, res) => {
// // //   try {
// // //     const entries     = await TeaEntry.find({ date: req.params.date });
// // //     const totalCups   = entries.reduce((sum, e) => sum + e.cups, 0);
// // //     const totalAmount = totalCups * 5;

// // //     return res.status(200).json({ date: req.params.date, totalCups, totalAmount, entries });
// // //   } catch (error) {
// // //     return res.status(500).json({ error: error.message });
// // //   }
// // // });

// // // // ✅ 4. GET BY MONTH
// // // router.get('/month/:month', async (req, res) => {
// // //   try {
// // //     const month   = decodeURIComponent(req.params.month);
// // //     const entries = await TeaEntry.find({ month });

// // //     const totalCups   = entries.reduce((sum, e) => sum + e.cups, 0);
// // //     const totalAmount = totalCups * 5;

// // //     const empSummary = {};
// // //     entries.forEach(e => {
// // //       if (!empSummary[e.employeeName]) {
// // //         empSummary[e.employeeName] = { cups: 0, amount: 0 };
// // //       }
// // //       empSummary[e.employeeName].cups   += e.cups;
// // //       empSummary[e.employeeName].amount += e.amount;
// // //     });

// // //     return res.status(200).json({ month, totalCups, totalAmount, employeeSummary: empSummary, entries });
// // //   } catch (error) {
// // //     return res.status(500).json({ error: error.message });
// // //   }
// // // });

// // // // ✅ 5. GET ALL
// // // router.get('/', async (req, res) => {
// // //   try {
// // //     const entries = await TeaEntry.find().sort({ createdAt: -1 });
// // //     return res.status(200).json(entries);
// // //   } catch (error) {
// // //     return res.status(500).json({ error: error.message });
// // //   }
// // // });

// // // module.exports = router;



// // const express  = require('express');
// // const router   = express.Router();
// // const TeaEntry = require('../models/TeaEntry');
// // const Employee = require('../models/Employee');

// // // ─── Helper: Date info ───────────────────────────────────────
// // function getDateInfo() {
// //   const now    = new Date();
// //   const days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
// //   const months = ['January','February','March','April','May','June',
// //                   'July','August','September','October','November','December'];

// //   const date  = now.toISOString().split('T')[0];
// //   const day   = days[now.getDay()];
// //   const time  = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
// //   const month = `${months[now.getMonth()]} ${now.getFullYear()}`;

// //   return { date, day, time, month };
// // }

// // // ✅ 1. SAVE TEA ENTRY — HAR CLICK PAR NEW ROW (accumulate nahi)
// // // Body: { entries: [{ employeeId, cups }] }
// // router.post('/save', async (req, res) => {
// //   try {
// //     const { entries } = req.body;

// //     console.log('📥 Received body:', JSON.stringify(req.body));

// //     if (!entries || !Array.isArray(entries) || entries.length === 0) {
// //       return res.status(400).json({ message: 'entries array required' });
// //     }

// //     const { date, day, time, month } = getDateInfo();
// //     const PRICE_PER_CUP = 5;

// //     const savedEntries = [];

// //     for (const entry of entries) {
// //       if (!entry.employeeId) {
// //         console.log('⚠️ employeeId missing, skipping');
// //         continue;
// //       }

// //       const emp = await Employee.findById(entry.employeeId);
// //       if (!emp) {
// //         console.log('⚠️ Employee not found:', entry.employeeId);
// //         continue;
// //       }

// //       const newCups = Number(entry.cups) || 0;
// //       if (newCups <= 0) {
// //         console.log('⚠️ cups 0 or less, skipping:', emp.name);
// //         continue;
// //       }

// //       const newAmount = newCups * PRICE_PER_CUP;

// //       // ✅ HAR CLICK PAR FRESH NEW ENTRY — koi check nahi existing ka
// //       const teaDoc = new TeaEntry({
// //         employeeId:   emp._id,
// //         employeeName: emp.name,
// //         cups:         newCups,
// //         pricePerCup:  PRICE_PER_CUP,
// //         amount:       newAmount,
// //         date,
// //         day,
// //         time,
// //         month,
// //         perdaytea:    0, // neeche update hoga
// //         monthtea:     0,
// //       });

// //       const saved = await teaDoc.save();
// //       console.log('✅ Saved entry:', emp.name, newCups, 'cups');
// //       savedEntries.push(saved);
// //     }

// //     if (savedEntries.length === 0) {
// //       return res.status(400).json({ message: 'Koi valid entry nahi mili. Employees check karo.' });
// //     }

// //     // ── Recalculate perdaytea (aaj ka total — sabhi entries ka sum) ──
// //     const todayEntries = await TeaEntry.find({ date });
// //     const perdaytea    = todayEntries.reduce((sum, e) => sum + e.cups, 0);

// //     // ── Recalculate monthtea (is mahine ka total) ────────────────────
// //     const monthEntries = await TeaEntry.find({ month });
// //     const monthtea     = monthEntries.reduce((sum, e) => sum + e.cups, 0);

// //     // ── Aaj ke sabhi entries mein updated totals save karo ───────────
// //     await TeaEntry.updateMany({ date }, { perdaytea, monthtea });

// //     return res.status(201).json({
// //       message:     'Tea entry saved ✅',
// //       date,
// //       day,
// //       perdaytea,
// //       monthtea,
// //       totalAmount: perdaytea * PRICE_PER_CUP,
// //       data:        savedEntries,
// //     });

// //   } catch (error) {
// //     console.error('❌ Save error:', error.message);
// //     return res.status(500).json({ error: error.message });
// //   }
// // });

// // // ✅ 2. GET TODAY'S ENTRIES — alag alag rows (har entry separate)
// // router.get('/today', async (req, res) => {
// //   try {
// //     const today   = new Date().toISOString().split('T')[0];
// //     // Sort by time so latest entries show at bottom
// //     const entries = await TeaEntry.find({ date: today }).sort({ createdAt: 1 });

// //     const totalCups   = entries.reduce((sum, e) => sum + e.cups, 0);
// //     const totalAmount = totalCups * 5;

// //     return res.status(200).json({ date: today, totalCups, totalAmount, entries });
// //   } catch (error) {
// //     console.error('❌ Today fetch error:', error.message);
// //     return res.status(500).json({ error: error.message });
// //   }
// // });

// // // ✅ 3. GET BY DATE
// // router.get('/date/:date', async (req, res) => {
// //   try {
// //     const entries     = await TeaEntry.find({ date: req.params.date }).sort({ createdAt: 1 });
// //     const totalCups   = entries.reduce((sum, e) => sum + e.cups, 0);
// //     const totalAmount = totalCups * 5;

// //     return res.status(200).json({ date: req.params.date, totalCups, totalAmount, entries });
// //   } catch (error) {
// //     return res.status(500).json({ error: error.message });
// //   }
// // });

// // // ✅ 4. GET BY MONTH
// // router.get('/month/:month', async (req, res) => {
// //   try {
// //     const month   = decodeURIComponent(req.params.month);
// //     const entries = await TeaEntry.find({ month }).sort({ createdAt: 1 });

// //     const totalCups   = entries.reduce((sum, e) => sum + e.cups, 0);
// //     const totalAmount = totalCups * 5;

// //     // Employee-wise summary (group karo)
// //     const empSummary = {};
// //     entries.forEach(e => {
// //       if (!empSummary[e.employeeName]) {
// //         empSummary[e.employeeName] = { cups: 0, amount: 0 };
// //       }
// //       empSummary[e.employeeName].cups   += e.cups;
// //       empSummary[e.employeeName].amount += e.amount;
// //     });

// //     return res.status(200).json({
// //       month,
// //       totalCups,
// //       totalAmount,
// //       employeeSummary: empSummary,
// //       entries,
// //     });
// //   } catch (error) {
// //     return res.status(500).json({ error: error.message });
// //   }
// // });

// // // ✅ 5. GET ALL
// // router.get('/', async (req, res) => {
// //   try {
// //     const entries = await TeaEntry.find().sort({ createdAt: -1 });
// //     return res.status(200).json(entries);
// //   } catch (error) {
// //     return res.status(500).json({ error: error.message });
// //   }
// // });

// // module.exports = router;



// // const express  = require('express');
// // const router   = express.Router();
// // const TeaEntry = require('../models/TeaEntry'); // teatracker collection
// // const Employee = require('../models/Employee'); // addemployer collection

// // // ─── Helper: Date info ───────────────────────────────────────
// // function getDateInfo() {
// //   const now    = new Date();
// //   const days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
// //   const months = ['January','February','March','April','May','June',
// //                   'July','August','September','October','November','December'];

// //   const date  = now.toISOString().split('T')[0];          // "2025-03-25"
// //   const day   = days[now.getDay()];                        // "Tuesday"
// //   const time  = now.toLocaleTimeString('en-IN', {
// //     hour: '2-digit', minute: '2-digit', hour12: true,
// //   });                                                       // "10:30 AM"
// //   const month = `${months[now.getMonth()]} ${now.getFullYear()}`; // "March 2025"

// //   return { date, day, time, month };
// // }

// // // ─────────────────────────────────────────────────────────────────────────────
// // // ✅ 1. SAVE TEA ENTRY
// // //    - addemployer se employee fetch karta hai (Employee model)
// // //    - teatracker mein new row save karta hai (TeaEntry model)
// // //    - Har Save click par ALAG row banta hai (accumulate nahi)
// // // Body: { entries: [{ employeeId, cups }] }
// // // ─────────────────────────────────────────────────────────────────────────────
// // router.post('/save', async (req, res) => {
// //   try {
// //     const { entries } = req.body;
// //     console.log('📥 /api/tea/save body:', JSON.stringify(req.body));

// //     if (!entries || !Array.isArray(entries) || entries.length === 0) {
// //       return res.status(400).json({ message: 'entries array required' });
// //     }

// //     const { date, day, time, month } = getDateInfo();
// //     const PRICE_PER_CUP = 5;
// //     const savedEntries  = [];

// //     for (const entry of entries) {
// //       // ── Validate employeeId ──────────────────────────────────
// //       if (!entry.employeeId) {
// //         console.log('⚠️ employeeId missing, skipping entry');
// //         continue;
// //       }

// //       // ── addemployer collection se employee dhundo ────────────
// //       const emp = await Employee.findById(entry.employeeId);
// //       if (!emp) {
// //         console.log('⚠️ Employee not found in addemployer:', entry.employeeId);
// //         continue;
// //       }

// //       const newCups = Number(entry.cups) || 0;
// //       if (newCups <= 0) {
// //         console.log('⚠️ cups <= 0, skipping:', emp.name);
// //         continue;
// //       }

// //       const newAmount = newCups * PRICE_PER_CUP;

// //       // ── teatracker mein FRESH NEW ROW create karo ────────────
// //       const teaDoc = new TeaEntry({
// //         employeeId:   emp._id,        // addemployer ka _id
// //         employeeName: emp.name,       // addemployer ka name
// //         cups:         newCups,
// //         pricePerCup:  PRICE_PER_CUP,
// //         amount:       newAmount,
// //         date,
// //         day,
// //         time,
// //         month,
// //         perdaytea: 0, // neeche recalculate hoga
// //         monthtea:  0,
// //       });

// //       const saved = await teaDoc.save();
// //       console.log(`✅ teatracker mein save hua: ${emp.name} — ${newCups} cups`);
// //       savedEntries.push(saved);
// //     }

// //     if (savedEntries.length === 0) {
// //       return res.status(400).json({
// //         message: 'Koi valid entry nahi mili. Employees aur cups check karo.',
// //       });
// //     }

// //     // ── Aaj ka total recalculate (sabhi teatracker entries) ──────
// //     const todayEntries = await TeaEntry.find({ date });
// //     const perdaytea    = todayEntries.reduce((sum, e) => sum + e.cups, 0);

// //     // ── Is mahine ka total recalculate ────────────────────────────
// //     const monthEntries = await TeaEntry.find({ month });
// //     const monthtea     = monthEntries.reduce((sum, e) => sum + e.cups, 0);

// //     // ── Aaj ki sabhi entries mein updated totals save karo ────────
// //     await TeaEntry.updateMany({ date }, { perdaytea, monthtea });

// //     return res.status(201).json({
// //       message:     'Tea entry saved ✅',
// //       date,
// //       day,
// //       perdaytea,
// //       monthtea,
// //       totalAmount: perdaytea * PRICE_PER_CUP,
// //       data:        savedEntries,
// //     });

// //   } catch (error) {
// //     console.error('❌ /api/tea/save error:', error.message);
// //     return res.status(500).json({ error: error.message });
// //   }
// // });

// // // ─────────────────────────────────────────────────────────────────────────────
// // // ✅ 2. GET TODAY'S ENTRIES — AddTeaScreen summary ke liye
// // //    teatracker collection se aaj ki sabhi entries
// // // ─────────────────────────────────────────────────────────────────────────────
// // router.get('/today', async (req, res) => {
// //   try {
// //     const today   = new Date().toISOString().split('T')[0];
// //     const entries = await TeaEntry.find({ date: today }).sort({ createdAt: 1 });

// //     const totalCups   = entries.reduce((sum, e) => sum + e.cups, 0);
// //     const totalAmount = totalCups * 5;

// //     console.log(`📋 Today (${today}): ${entries.length} entries, ${totalCups} cups`);

// //     return res.status(200).json({ date: today, totalCups, totalAmount, entries });
// //   } catch (error) {
// //     console.error('❌ /api/tea/today error:', error.message);
// //     return res.status(500).json({ error: error.message });
// //   }
// // });

// // // ─────────────────────────────────────────────────────────────────────────────
// // // ✅ 3. GET BY DATE
// // // ─────────────────────────────────────────────────────────────────────────────
// // router.get('/date/:date', async (req, res) => {
// //   try {
// //     const entries     = await TeaEntry.find({ date: req.params.date }).sort({ createdAt: 1 });
// //     const totalCups   = entries.reduce((sum, e) => sum + e.cups, 0);
// //     const totalAmount = totalCups * 5;

// //     return res.status(200).json({ date: req.params.date, totalCups, totalAmount, entries });
// //   } catch (error) {
// //     return res.status(500).json({ error: error.message });
// //   }
// // });

// // // ─────────────────────────────────────────────────────────────────────────────
// // // ✅ 4. GET BY MONTH — employee-wise summary bhi
// // // ─────────────────────────────────────────────────────────────────────────────
// // router.get('/month/:month', async (req, res) => {
// //   try {
// //     const month   = decodeURIComponent(req.params.month);
// //     const entries = await TeaEntry.find({ month }).sort({ createdAt: 1 });

// //     const totalCups   = entries.reduce((sum, e) => sum + e.cups, 0);
// //     const totalAmount = totalCups * 5;

// //     // Employee-wise group summary
// //     const empSummary = {};
// //     entries.forEach(e => {
// //       if (!empSummary[e.employeeName]) {
// //         empSummary[e.employeeName] = { cups: 0, amount: 0 };
// //       }
// //       empSummary[e.employeeName].cups   += e.cups;
// //       empSummary[e.employeeName].amount += e.amount;
// //     });

// //     return res.status(200).json({
// //       month, totalCups, totalAmount, employeeSummary: empSummary, entries,
// //     });
// //   } catch (error) {
// //     return res.status(500).json({ error: error.message });
// //   }
// // });

// // // ─────────────────────────────────────────────────────────────────────────────
// // // ✅ 5. GET ALL ENTRIES
// // // ─────────────────────────────────────────────────────────────────────────────
// // router.get('/', async (req, res) => {
// //   try {
// //     const entries = await TeaEntry.find().sort({ createdAt: -1 });
// //     return res.status(200).json(entries);
// //   } catch (error) {
// //     return res.status(500).json({ error: error.message });
// //   }
// // });

// // module.exports = router;




// const express  = require('express');
// const router   = express.Router();
// const TeaEntry = require('../models/TeaEntry');
// const Employee = require('../models/Employee');

// // ─── Helpers ─────────────────────────────────────────────────

// const MONTH_NAMES = [
//   'January','February','March','April','May','June',
//   'July','August','September','October','November','December',
// ];
// const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

// // "2025-02-15" → { month: "February 2025", day: "Saturday" }
// function infoFromDateStr(dateStr) {
//   const [year, mm, dd] = dateStr.split('-').map(Number);
//   const d     = new Date(year, mm - 1, dd);
//   const month = `${MONTH_NAMES[mm - 1]} ${year}`;
//   const day   = DAY_NAMES[d.getDay()];
//   return { month, day };
// }

// // Aaj ki date "YYYY-MM-DD"
// function todayStr() {
//   const now = new Date();
//   return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
// }

// // Current time "10:30 AM"
// function currentTime() {
//   return new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', hour12:true });
// }

// // ─────────────────────────────────────────────────────────────
// // POST /api/tea/save
// // ✅ FIX: date ab body se aata hai — selectedDate (past/present)
// //         month date se calculate hota hai
// // Body: { date: "2025-02-15", entries: [{ employeeId, cups }] }
// // ─────────────────────────────────────────────────────────────
// router.post('/save', async (req, res) => {
//   try {
//     const { entries, date: bodyDate } = req.body;
//     console.log('📥 /api/tea/save body:', JSON.stringify(req.body));

//     if (!entries || !Array.isArray(entries) || entries.length === 0) {
//       return res.status(400).json({ message: 'entries array required' });
//     }

//     // ✅ FIX: body mein date aaya to use karo, nahi to aaj ki date
//     const entryDate = bodyDate || todayStr();

//     // ✅ FIX: month aur day HAMESHA entryDate se calculate karo
//     const { month, day } = infoFromDateStr(entryDate);
//     const time = currentTime();

//     console.log(`📅 Entry date: ${entryDate} → month: "${month}", day: "${day}"`);

//     const PRICE_PER_CUP = 5;
//     const savedEntries  = [];

//     for (const entry of entries) {
//       if (!entry.employeeId) continue;

//       const emp = await Employee.findById(entry.employeeId);
//       if (!emp) {
//         console.log('⚠️ Employee not found:', entry.employeeId);
//         continue;
//       }

//       const cups = Number(entry.cups) || 0;
//       if (cups <= 0) continue;

//       const teaDoc = new TeaEntry({
//         employeeId:   emp._id,
//         employeeName: emp.name,
//         cups,
//         pricePerCup:  PRICE_PER_CUP,
//         amount:       cups * PRICE_PER_CUP,
//         date:         entryDate,   // ✅ selectedDate se aaya
//         day,                       // ✅ entryDate se calculate hua
//         time,
//         month,                     // ✅ entryDate se calculate hua — "February 2025"
//         perdaytea: 0,
//         monthtea:  0,
//       });

//       const saved = await teaDoc.save();
//       console.log(`✅ Saved: ${emp.name} — ${cups} cups — ${entryDate} — ${month}`);
//       savedEntries.push(saved);
//     }

//     if (savedEntries.length === 0) {
//       return res.status(400).json({ message: 'Koi valid entry nahi mili.' });
//     }

//     // ── Us din ka total recalculate ──────────────────────────
//     const dayEntries = await TeaEntry.find({ date: entryDate });
//     const perdaytea  = dayEntries.reduce((s, e) => s + e.cups, 0);

//     // ── Us month ka total recalculate ────────────────────────
//     const monthEntries = await TeaEntry.find({ month });
//     const monthtea     = monthEntries.reduce((s, e) => s + e.cups, 0);

//     // ── Us din ki sab entries mein updated totals save karo ──
//     await TeaEntry.updateMany({ date: entryDate }, { perdaytea, monthtea });

//     return res.status(201).json({
//       message:     'Tea entry saved ✅',
//       date:        entryDate,
//       day,
//       month,
//       perdaytea,
//       monthtea,
//       totalAmount: perdaytea * PRICE_PER_CUP,
//       data:        savedEntries,
//     });

//   } catch (error) {
//     console.error('❌ /api/tea/save error:', error.message);
//     return res.status(500).json({ error: error.message });
//   }
// });

// // ─────────────────────────────────────────────────────────────
// // GET /api/tea/today
// // ─────────────────────────────────────────────────────────────
// router.get('/today', async (req, res) => {
//   try {
//     const today   = todayStr();
//     const entries = await TeaEntry.find({ date: today }).sort({ createdAt: 1 });

//     const totalCups   = entries.reduce((s, e) => s + e.cups, 0);
//     const totalAmount = totalCups * 5;

//     return res.status(200).json({ date: today, totalCups, totalAmount, entries });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// });

// // ─────────────────────────────────────────────────────────────
// // GET /api/tea/date/:date
// // ✅ NEW — kisi bhi date ki entries (addtea screen refresh ke liye)
// // Example: GET /api/tea/date/2025-02-15
// // ─────────────────────────────────────────────────────────────
// router.get('/date/:date', async (req, res) => {
//   try {
//     const dateStr = req.params.date;
//     const entries = await TeaEntry.find({ date: dateStr }).sort({ createdAt: 1 });

//     const totalCups   = entries.reduce((s, e) => s + e.cups, 0);
//     const totalAmount = totalCups * 5;

//     return res.status(200).json({ date: dateStr, totalCups, totalAmount, entries });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// });

// // ─────────────────────────────────────────────────────────────
// // GET /api/tea/month/:month
// // Example: GET /api/tea/month/February%202025
// // ─────────────────────────────────────────────────────────────
// router.get('/month/:month', async (req, res) => {
//   try {
//     const month   = decodeURIComponent(req.params.month);
//     const entries = await TeaEntry.find({ month }).sort({ createdAt: 1 });

//     const totalCups   = entries.reduce((s, e) => s + e.cups, 0);
//     const totalAmount = totalCups * 5;

//     const empSummary = {};
//     entries.forEach(e => {
//       if (!empSummary[e.employeeName]) empSummary[e.employeeName] = { cups: 0, amount: 0 };
//       empSummary[e.employeeName].cups   += e.cups;
//       empSummary[e.employeeName].amount += e.amount;
//     });

//     return res.status(200).json({ month, totalCups, totalAmount, employeeSummary: empSummary, entries });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// });

// // ─────────────────────────────────────────────────────────────
// // GET /api/tea/
// // Sab entries — HomeScreen history grouping ke liye
// // ─────────────────────────────────────────────────────────────
// router.get('/', async (req, res) => {
//   try {
//     const entries = await TeaEntry.find().sort({ createdAt: -1 });
//     return res.status(200).json(entries);
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;



const express  = require('express');
const router   = express.Router();
const TeaEntry = require('../models/TeaEntry');
const Employee = require('../models/Employee');

// ─── Helpers ─────────────────────────────────────────────────

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function infoFromDateStr(dateStr) {
  const [year, mm, dd] = dateStr.split('-').map(Number);
  const d     = new Date(year, mm - 1, dd);
  const month = `${MONTH_NAMES[mm - 1]} ${year}`;
  const day   = DAY_NAMES[d.getDay()];
  return { month, day };
  
}

function todayStr() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
}

function currentTime() {
  return new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', hour12:true });
}
//# 
// ── Helper: recalculate perdaytea + monthtea ─────────────────
async function recalcTotals(date, month) {
  const dayEntries   = await TeaEntry.find({ date });
  const monthEntries = await TeaEntry.find({ month });
  const perdaytea    = dayEntries.reduce((s, e) => s + e.cups, 0);
  const monthtea     = monthEntries.reduce((s, e) => s + e.cups, 0);
  if (dayEntries.length > 0) {
    await TeaEntry.updateMany({ date }, { perdaytea, monthtea });
  }
  return { perdaytea, monthtea };
}

// ─────────────────────────────────────────────────────────────
// POST /api/tea/save
// ─────────────────────────────────────────────────────────────
router.post('/save', async (req, res) => {
  try {
    const { entries, date: bodyDate } = req.body;
    console.log('📥 /api/tea/save body:', JSON.stringify(req.body));

    if (!entries || !Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({ message: 'entries array required' });
    }

    const entryDate        = bodyDate || todayStr();
    const { month, day }   = infoFromDateStr(entryDate);
    const time             = currentTime();
    const PRICE_PER_CUP    = 5;
    const savedEntries     = [];

    for (const entry of entries) {
      if (!entry.employeeId) continue;
      const emp = await Employee.findById(entry.employeeId);
      if (!emp) continue;
      const cups = Number(entry.cups) || 0;
      if (cups <= 0) continue;

      const teaDoc = new TeaEntry({
        employeeId: emp._id, employeeName: emp.name, cups,
        pricePerCup: PRICE_PER_CUP, amount: cups * PRICE_PER_CUP,
        date: entryDate, day, time, month, perdaytea: 0, monthtea: 0,
      });
      const saved = await teaDoc.save();
      savedEntries.push(saved);
    }

    if (savedEntries.length === 0) {
      return res.status(400).json({ message: 'Koi valid entry nahi mili.' });
    }

    const { perdaytea, monthtea } = await recalcTotals(entryDate, month);

    return res.status(201).json({
      message: 'Tea entry saved ✅', date: entryDate, day, month,
      perdaytea, monthtea, totalAmount: perdaytea * PRICE_PER_CUP, data: savedEntries,
    });
  } catch (error) {
    console.error('❌ /api/tea/save error:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────
// PUT /api/tea/:id  — single entry ke cups update karo
// Body: { cups: 3 }
// ─────────────────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const newCups = Number(req.body.cups);
    if (!newCups || newCups <= 0)
      return res.status(400).json({ message: 'Valid cups value required (> 0)' });

    const entry = await TeaEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Entry nahi mili.' });

    entry.cups   = newCups;
    entry.amount = newCups * 5;
    await entry.save();

    const { perdaytea, monthtea } = await recalcTotals(entry.date, entry.month);
    return res.status(200).json({ message: 'Entry updated ✅', entry, perdaytea, monthtea });
  } catch (error) {
    console.error('❌ PUT /:id error:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────
// DELETE /api/tea/date/:date  ✅ NEW
// Us poori date ki SAARI entries ek saath delete karo
// Example: DELETE /api/tea/date/2025-03-15
// ─────────────────────────────────────────────────────────────
router.delete('/date/:date', async (req, res) => {
  try {
    const dateStr    = req.params.date;
    const { month }  = infoFromDateStr(dateStr);

    const result = await TeaEntry.deleteMany({ date: dateStr });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: `${dateStr} ki koi entry nahi mili.` });
    }

    console.log(`🗑️ Deleted ${result.deletedCount} entries for date: ${dateStr}`);

    // Baaki mahine ki entries mein monthtea recalculate karo
    const monthEntries = await TeaEntry.find({ month });
    const monthtea     = monthEntries.reduce((s, e) => s + e.cups, 0);
    if (monthEntries.length > 0) {
      await TeaEntry.updateMany({ month }, { monthtea });
    }

    return res.status(200).json({
      message:      `${dateStr} ki saari entries delete ho gayi ✅`,
      deletedCount: result.deletedCount,
      monthtea,
    });
  } catch (error) {
    console.error('❌ DELETE /date/:date error:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────
// DELETE /api/tea/:id  — single entry delete
// ─────────────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const entry = await TeaEntry.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Entry nahi mili.' });

    console.log(`🗑️ Deleted: ${entry.employeeName} — ${entry.cups} cups — ${entry.date}`);

    const dayEntries = await TeaEntry.find({ date: entry.date });
    let perdaytea = 0, monthtea = 0;
    if (dayEntries.length > 0) {
      const r = await recalcTotals(entry.date, entry.month);
      perdaytea = r.perdaytea; monthtea = r.monthtea;
    }
    return res.status(200).json({ message: 'Entry delete ho gayi ✅', perdaytea, monthtea });
  } catch (error) {
    console.error('❌ DELETE /:id error:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/tea/today
// ─────────────────────────────────────────────────────────────
router.get('/today', async (req, res) => {
  try {
    const today   = todayStr();
    const entries = await TeaEntry.find({ date: today }).sort({ createdAt: 1 });
    const totalCups   = entries.reduce((s, e) => s + e.cups, 0);
    return res.status(200).json({ date: today, totalCups, totalAmount: totalCups * 5, entries });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/tea/date/:date
// ─────────────────────────────────────────────────────────────
router.get('/date/:date', async (req, res) => {
  try {
    const dateStr = req.params.date;
    const entries = await TeaEntry.find({ date: dateStr }).sort({ createdAt: 1 });
    const totalCups   = entries.reduce((s, e) => s + e.cups, 0);
    return res.status(200).json({ date: dateStr, totalCups, totalAmount: totalCups * 5, entries });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/tea/month/:month
// ─────────────────────────────────────────────────────────────
router.get('/month/:month', async (req, res) => {
  try {
    const month   = decodeURIComponent(req.params.month);
    const entries = await TeaEntry.find({ month }).sort({ createdAt: 1 });
    const totalCups   = entries.reduce((s, e) => s + e.cups, 0);
    const totalAmount = totalCups * 5;
    const empSummary  = {};
    entries.forEach(e => {
      if (!empSummary[e.employeeName]) empSummary[e.employeeName] = { cups: 0, amount: 0 };
      empSummary[e.employeeName].cups   += e.cups;
      empSummary[e.employeeName].amount += e.amount;
    });
    return res.status(200).json({ month, totalCups, totalAmount, employeeSummary: empSummary, entries });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/tea/
// ─────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const entries = await TeaEntry.find().sort({ createdAt: -1 });
    return res.status(200).json(entries);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;