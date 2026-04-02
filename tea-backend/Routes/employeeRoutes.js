// const express = require('express');
// const router = express.Router();
// const Employee = require('../models/Employee');

// // ✅ ADD EMPLOYEE
// router.post('/add', async (req, res) => {
//   try {
//     console.log('📥 Body received:', req.body);

//     const { name, role } = req.body;

//     if (!name || name.trim() === '') {
//       return res.status(400).json({ message: 'Name is required' });
//     }

//     const newEmployee = new Employee({
//       name: name.trim(),
//       role: role ? role.trim() : 'Employee',
//     });

//     const saved = await newEmployee.save();
//     console.log('✅ Saved:', saved);

//     return res.status(201).json({
//       message: 'Employee Added Successfully',
//       data: saved,
//     });

//   } catch (error) {
//     console.log('❌ Error:', error.message);
//     return res.status(500).json({ error: error.message });
//   }
// });

// // ✅ GET ALL EMPLOYEES
// router.get('/', async (req, res) => {
//   try {
//     const employees = await Employee.find().sort({ createdAt: -1 });
//     return res.status(200).json(employees);
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// });

// // ✅ GET SINGLE EMPLOYEE
// router.get('/:id', async (req, res) => {
//   try {
//     const emp = await Employee.findById(req.params.id);
//     if (!emp) {
//       return res.status(404).json({ message: 'Employee not found' });
//     }
//     return res.status(200).json(emp);
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// });

// // ✅ UPDATE EMPLOYEE
// router.put('/update/:id', async (req, res) => {
//   try {
//     const { name, role } = req.body;

//     if (!name || name.trim() === '') {
//       return res.status(400).json({ message: 'Name is required' });
//     }

//     const updated = await Employee.findByIdAndUpdate(
//       req.params.id,
//       { name: name.trim(), role: role ? role.trim() : 'Employee' },
//       { new: true, runValidators: true }
//     );

//     if (!updated) {
//       return res.status(404).json({ message: 'Employee not found' });
//     }

//     return res.status(200).json({
//       message: 'Employee Updated Successfully',
//       data: updated,
//     });

//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// });


// // ✅ DELETE EMPLOYEE
// router.delete('/delete/:id', async (req, res) => {
//   try {
//     console.log('🗑️ Delete request for ID:', req.params.id);

//     const deleted = await Employee.findByIdAndDelete(req.params.id);

//     if (!deleted) {
//       return res.status(404).json({ message: 'Employee not found' });
//     }

//     return res.status(200).json({ message: 'Employee Deleted Successfully' });

//   } catch (error) {
//     console.log('❌ Delete error:', error.message);
//     return res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;
// ###



const express  = require('express');
const router   = express.Router();
const Employee = require('../models/Employee'); // addemployer collection

// ✅ ADD EMPLOYEE
router.post('/add', async (req, res) => {
  try {
    console.log('📥 Body received:', req.body);

    const { name, role } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Name is required' });
    }

    const newEmployee = new Employee({
      name: name.trim(),
      role: role ? role.trim() : 'Employee',
    });

    const saved = await newEmployee.save();
    console.log('✅ Employee saved in addemployer:', saved);

    return res.status(201).json({
      message: 'Employee Added Successfully',
      data: saved,
    });

  } catch (error) {
    console.log('❌ Add Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

// ✅ GET ALL EMPLOYEES (AddTeaScreen mein use hoga)
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    console.log(`📋 Sending ${employees.length} employees from addemployer`);
    return res.status(200).json(employees);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ✅ GET SINGLE EMPLOYEE
router.get('/:id', async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    return res.status(200).json(emp);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ✅ UPDATE EMPLOYEE
router.put('/update/:id', async (req, res) => {
  try {
    const { name, role } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Name is required' });
    }

    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      { name: name.trim(), role: role ? role.trim() : 'Employee' },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    return res.status(200).json({
      message: 'Employee Updated Successfully',
      data: updated,
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ✅ DELETE EMPLOYEE
router.delete('/delete/:id', async (req, res) => {
  try {
    console.log('🗑️ Delete request for ID:', req.params.id);

    const deleted = await Employee.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    return res.status(200).json({ message: 'Employee Deleted Successfully' });

  } catch (error) {
    console.log('❌ Delete error:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;