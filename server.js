const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json()); 

app.use("/", express.static("public"));

mongoose.connect('mongodb://localhost:27017/personalBudget')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));


const budgetSchema = new mongoose.Schema({
    title: { type: String, required: true },
    budget: { type: Number, required: true },
    color: { type: String, required: true, match: /^#([A-Fa-f0-9]{6})$/ } 
});


const savingsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    savings: { type: Number, required: true },
    color: { type: String, required: true, match: /^#([A-Fa-f0-9]{6})$/ } 
});

const Budget = mongoose.model('Budget', budgetSchema);
const Savings = mongoose.model('Savings', savingsSchema);

app.get('/budget', async (req, res) => {
    try {
        const budgets = await Budget.find();
        res.json({ myBudget: budgets });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching budget data' });
    }
});

app.get('/savings', async (req, res) => {
    try {
        const savings = await Savings.find();
        res.json({ mySavings: savings });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching savings data' });
    }
});

app.post('/budget', async (req, res) => {
    const budgetData = req.body; 

    try {
        if (Array.isArray(budgetData)) {
            const newBudgets = await Budget.insertMany(budgetData);
            res.status(201).json(newBudgets);
        } else {
            res.status(400).json({ message: 'Expected an array of budget items' });
        }
    } catch (err) {
        res.status(400).json({ message: 'Error adding budget data' });
    }
});

app.post('/savings', async (req, res) => {
    const savingsData = req.body; 

    try {
        if (Array.isArray(savingsData)) {
            const newSavings = await Savings.insertMany(savingsData);
            res.status(201).json(newSavings);
        } else {
            res.status(400).json({ message: 'Expected an array of savings items' });
        }
    } catch (err) {
        console.error("Error inserting data:", err.message);  
        res.status(400).json({ message: 'Error adding budget data', error: err.message });
    }
});


app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});
