const PORT = process.env.PORT ?? 4000;
const express = require('express');
const cors = require('cors');
const {v4:uuidv4} = require('uuid');
const app = express();
const pool = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
 
app.use(cors());
app.use(express.json());


// get all todos
app.get('/todos/:userEmail', async (req,res) => {
    const {userEmail} = req.params;
    try {
       const todos = await pool.query('SELECT * FROM todos WHERE user_email = $1', [userEmail]);
       res.json(todos.rows)
    } catch (error) {
        console.log(error)
    }
})

// Create a new todo
app.post('/todos', async (req,res) => {
    const {user_email, title, progress} = req.body;
    console.log(user_email, title, progress);
    const id = uuidv4();
    try {
       const newTodo = await pool.query(`INSERT INTO todos(id,user_email,title,progress) VALUES($1, $2, $3, $4)`, [id, user_email, title,progress])
       res.json(newTodo)
    } catch (error) {
        console.error(error)
    }
})

// edit a new todo
app.put('/todos/:id', async(req,res) => {
    const {id} = req.params;
    const {user_email, title, progress} = req.body;
    try {
        const editTodo = await pool.query('UPDATE todos SET user_email = $1, title = $2, progress = $3 WHERE id = $4', [user_email, title, progress, id]);
        res.json(editTodo);
    } catch (error) {
        console.error(error)
    }
})

// delete todo 
app.delete('/todos/:id', async(req,res) => {
    const {id} = req.params;
    try {
        const deleteTodo = await pool.query('DELETE FROM todos WHERE id = $1;',[id]);
        res.json(deleteTodo);
    } catch (error) {
        console.log(error)
    }
})

// API signup
app.post('/signup', async(req,res) => {
    const {email, password} = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    try {
       const signUp = await pool.query(`INSERT INTO users (email, hashed_password) VALUES($1, $2)`, [email, hashedPassword])
       const token = jwt.sign({email}, 'secret', {expiresIn: '1hr'})
       res.json({email, token})
    } catch (error) {
        console.error(error)    
        if(error) {
            res.json({details: error.details})
        }
    }
});

app.post('/login', async(req,res) => {
    const {email, password} = req.body;
    try {
        const users = await pool.query('SELECT * FROM users WHERE email = $1', [email])
       if(!users.rows.length) {
            return res.json({detail: 'User does not exits'})
       }
        const success = await bcrypt.compare(password, users.rows[0].hashed_password);
        const token = jwt.sign({email}, 'secret', {expiresIn: '1hr'})
        if(success) {
            res.json({"email": users.rows[0].email, token})
        } else {
            res.json({detail: "Login failed"})
        }
    } catch (error) {
        console.error(error)
    }
})

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))