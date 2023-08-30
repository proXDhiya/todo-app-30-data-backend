const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const db = fs.readFileSync(path.resolve(__dirname, 'db.json'));
const data = JSON.parse(db);

app.get('/api', (req, res) => {
    return res.status(200).json({ data: 'hello world' })
});

app.get('/api/todo', (req, res) => {
    return res.status(200).json({ data: data.todo });
});

app.get('/api/done', (req, res) => {
    return res.status(200).json({ data: data.done });
});

app.post('/api/todo', async (req, res) => {
    const id = Math.floor(Math.random() * 100000);
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'title is required' });
    }

    data.todo.push({ id, title });
    await fs.writeFileSync(path.resolve(__dirname, 'db.json'), JSON.stringify(data));

    return res.status(200).json({ data: data.todo });
});

app.post('/api/done', async (req, res) => {
    let { id } = req.body;
    id = parseInt(id);

    if (!id) {
        return res.status(400).json({ error: 'id is required' });
    }

    const index = data.todo.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(400).json({ error: 'id not found' });
    }

    const item = data.todo[index];
    data.todo.splice(index, 1);
    data.done.push(item);
    await fs.writeFileSync(path.resolve(__dirname, 'db.json'), JSON.stringify(data));

    return res.status(200).json({ data: data.todo });
});

app.delete('/api/done/all', async (req, res) => {
    data.done = [];
    await fs.writeFileSync(path.resolve(__dirname, 'db.json'), JSON.stringify(data));

    return res.status(200).json({ data: data.done });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
