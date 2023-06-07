const express = require('express');
const employees = express.Router();
const db = require('../config/database');

employees.post('/', async (req, res, next) => {
    const { name, lastname, phone, mail, address, password } = req.body;

    if(name && lastname && phone && mail && address && password) {
        let query = "INSERT INTO employees (name, lastname, phone, mail, address, password)";
        query += ` VALUES ('${name}', '${lastname}', '${phone}', '${mail}', '${address}', '${password}');`;
    
        const rows = await db.query(query);
        if(rows.affectedRows == 1) {
            return res.status(201).json({ code: 201, message: "Successfully registered employee..."});
        }
        return res.status(500).json({ code: 500, message: "An error occurred..."});
    }
    return res.status(500).json({ code: 500, message: "Incomplete data..."});
});

employees.delete('/:id([0-9]{1,3})', async (req, res, next) => {
    const query = `DELETE FROM employees WHERE id=${req.params.id};`;
    const rows = await db.query(query);

    if(rows.affectedRows == 1) {
        return res.status(200).json({ code: 200, message: "Deleted employee..."});
    }
    return res.status(404).json({ code: 404, message: "Employee not found..."});
});

employees.put('/:id([0-9]{1,3})', async (req, res, next) => {
    const { name, lastname, phone, mail, address, password } = req.body;

    if(name && lastname && phone && mail && address && password) {
        let query = `UPDATE employees SET name='${name}', lastname='${lastname}', phone='${phone}',`;
        query += ` mail='${mail}', address='${address}, password='${password}'' WHERE id=${req.params.id};`;
    
        const rows = await db.query(query);

        if(rows.affectedRows == 1) {
            return res.status(200).json({ code: 200, message: "Employee updated successfully..."});
        }
        return res.status(500).json({ code: 500, message: "An error occurred..."});
    }
    return res.status(500).json({ code: 500, message: "Incomplete data..."});
});

employees.patch('/:id([0-9]{1,3})', async (req, res, next) => {

    if(req.body.name) {
        let query = `UPDATE employees SET name='${req.body.name}' WHERE id=${req.params.id};`;
        const rows = await db.query(query);

        if(rows.affectedRows == 1) {
            return res.status(200).json({ code: 200, message: "Employee updated successfully..."});
        }
        return res.status(500).json({ code: 500, message: "An error occurred..."});
    }
    return res.status(500).json({ code: 500, message: "Incomplete data..."});    
});

employees.get('/', async(req, res, next) => {
    const employee = await db.query("SELECT * FROM employees");
    return res.status(200).json({code: 200, message: employee});
});

employees.get('/:id([0-9]{1,3})', async (req, res, next) => {
    const id = req.params.id;
    if(id >= 0 && id <= 50) {
        const employee = await db.query("SELECT * FROM employees WHERE id='" + id + "';");
        return res.status(200).json({code: 200, message: employee});
    }
    return res.status(404).send({code: 404, message:"Employee not found..."});
});

employees.get('/:name([A-Za-z]+)', async (req, res, next) => {
    const name = req.params.name;
    const employee = await db.query("SELECT * FROM employees WHERE name='" + name + "';");
    if(employee.length > 0) {
        return res.status(200).json({ code: 200, message: employee});
    }
    return res.status(404).send({code: 404, message:"Employee not found..."});
});

module.exports = employees;


