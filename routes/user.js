const express = require('express');
const jwt = require('jsonwebtoken');
const user = express.Router();
const db = require('../config/database');

user.post('/signin', async (req, res, next) => {
    const { name, mail, password } = req.body;

    if(name && mail && password) {
        let query = "INSERT INTO user (name, mail, password)";
        query += ` VALUES ('${name}', '${mail}', '${password}');`;
    
        const rows = await db.query(query);
        if(rows.affectedRows == 1) {
            return res.status(201).json({ code: 201, message: "Successfully registered employee..."});
        }
        return res.status(500).json({ code: 500, message: "An error occurred..."});
    }
    return res.status(500).json({ code: 500, message: "Incomplete data..."});
});

user.post('/login', async (req, res, next) => {
    const { mail, password } = req.body;
    const query = `SELECT * FROM user WHERE mail = '${mail}' AND password= '${password}';`;
    const rows = await db.query(query);

    if(mail && password) {
        if(rows.length == 1) {
            const token = jwt.sign({
                id: rows[0].id,
                mail: rows[0].mail
            }, "debugkey");
            return res.status(200).json({ code: 200, message: token});
        }
        else {
            return res.status(200).json({ code: 401, message: "Wrong email and/or password..."});
        }
    }
    return res.status(500).json({ code: 500, message: "Incomplete data..."});
});

user.get('/', async (req, res, next) => {
    const query = "SELECT id, name, mail, password FROM employees;";
    const rows = await db.query(query);

    return res.status(200).json({ code: 200, message: rows});
});

user.delete('/employeeData', async (req, res, next) => {
    const { id } = req.body;
    const query = `DELETE FROM employees WHERE id=${id};`;
    const rows = await db.query(query);

    if(rows.affectedRows == 1) {
        return res.status(200).json({ code: 200, message: "Deleted employee..."});
    }
    return res.status(404).json({ code: 404, message: "Employee not found..."});
});

user.post('/employeeData', async (req, res, next) => {
    const { name, lastname, phone, mail, address } = req.body;

    if(name && lastname && phone && mail && address) {
        let query = "INSERT INTO employees (name, lastname, phone, mail, address)";
        query += ` VALUES ('${name}', '${lastname}', '${phone}', '${mail}', '${address}');`;
    
        const rows = await db.query(query);
        if(rows.affectedRows == 1) {
            return res.status(201).json({ code: 201, message: "Successfully registered employee..."});
        }
        return res.status(500).json({ code: 500, message: "An error occurred..."});
    }
    return res.status(500).json({ code: 500, message: "Incomplete data..."});
});

user.patch('employeeData', async (req, res, next) => {
    const { id, name, lastname, phone, mail, address } = req.body;

    if( id && name && lastname && phone && mail && address) {
        let query = `UPDATE employees SET name='${name}, lastname=${lastname}, phone=${phone}, mail=${mail}, address=${address}'`
        query += `WHERE id=${id};`;
        const rows = await db.query(query);

        if(rows.affectedRows == 1) {
            return res.status(200).json({ code: 200, message: "Employee updated successfully..."});
        }
        return res.status(500).json({ code: 500, message: "An error occurred..."});
    }
    return res.status(500).json({ code: 500, message: "Incomplete data..."});    
});

user.get('/employeeData', async (req, res, next) => {
    const id = req.query.id;
    if(id >= 0 && id <= 50) {
        const employee = await db.query("SELECT * FROM employees WHERE id='" + id + "';");
        return res.status(200).json({code: 200, message: employee});
    }
    return res.status(404).send({code: 404, message:"Employee not found..."});
});
module.exports = user;
