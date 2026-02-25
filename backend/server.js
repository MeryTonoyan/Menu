import express from 'express';
import cors from 'cors';
import db from "./config/db.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/categories', async (req, res) => {
    let [row] = await db.query('SELECT * FROM categories');
    res.json(row);
});

app.get('/categories/:id', async (req, res) => {
    let id = req.params.id;
    let [row] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    res.json(row[0]);
});

app.get('/products/:id', async (req, res) => {
    let id = req.params.id;
    let [row] = await db.query('SELECT * FROM products WHERE category_id=?', [id]);
    res.json(row);
});

app.post('/category', async (req, res) => {
    let {name} = req.body;
    let [query] = await db.query('INSERT INTO categories (name) VALUES (?)', [name]);
    res.json({ id: query.insertId, name });
});


app.get('/products/:id', async (req, res) => {
    let id = req.params.id;
    let [row] = await db.query('SELECT * FROM products WHERE cat_id=?', [id]);
    res.json(row);
});

app.post('/product', async (req, res) => {
    let {name, cat_id, price} = req.body;
    if (!cat_id || !name || !price) {
        return res.json({error: "please fill all fields"});
    }
    let [query] = await db.query("INSERT INTO products (name, cat_id, price) VALUES (?, ?, ?)", [name, cat_id, price]);
    res.json({ id: query.insertId, name, cat_id, price });
});
app.put('/product/move', async (req, res) => {
    let { id, cat_id } = req.body;
    await db.query('UPDATE products SET cat_id = ? WHERE id = ?', [cat_id, id]);
    res.json({ message: "moved" });
});

app.delete('/product/:id', async (req, res) => {
    let id = req.params.id;
    await db.query('DELETE FROM products WHERE id=?', [id]);
    res.json({ message: "deleted" });
});

const port = 3008;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});