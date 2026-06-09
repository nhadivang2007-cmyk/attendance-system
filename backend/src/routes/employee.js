const express = require('express');
const db = require('../db/config');
const { authorize } = require('../middleware/auth');

const router = express.Router();

// Get all employees (admin only)
router.get('/', authorize(['admin']), async (req, res) => {
  try {
    const result = await db.query(`
      SELECT e.*, u.email, u.full_name, u.is_active
      FROM employees e
      JOIN users u ON e.user_id = u.id
      ORDER BY e.employee_code
    `);
    res.json({ data: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current employee
router.get('/me', async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query(`
      SELECT e.*, u.email, u.full_name
      FROM employees e
      JOIN users u ON e.user_id = u.id
      WHERE e.user_id = $1
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create employee (admin only)
router.post('/', authorize(['admin']), async (req, res) => {
  try {
    const { user_id, employee_code, department, position, phone, date_of_birth, address } = req.body;

    const result = await db.query(
      `INSERT INTO employees (user_id, employee_code, department, position, phone, date_of_birth, address)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [user_id, employee_code, department, position, phone, date_of_birth, address]
    );

    res.status(201).json({ data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update employee
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { department, position, phone, address } = req.body;

    const result = await db.query(
      `UPDATE employees
       SET department = COALESCE($1, department),
           position = COALESCE($2, position),
           phone = COALESCE($3, phone),
           address = COALESCE($4, address),
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [department, position, phone, address, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
