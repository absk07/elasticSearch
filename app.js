const express = require('express');
const { Client } = require('@elastic/elasticsearch');
const elasticClient = new Client({ node: 'http://localhost:9200' });
const { v4: uuid } = require('uuid');
const { Product, data } = require('./seeds');
const PORT = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/products', async (req, res) => {
    try {
        const products = await Product();
        // console.log(products);
        res.json(products);
    } catch(err) {
        console.log(err);
        res.json(err);
    }
});


app.post('/products', async (req, res) => {
    try {
        data.push({id: uuid(), ...req.body});
        await elasticClient.index({
            index: 'products',
            body: {
                id: uuid(),
                ...req.body
            }
        });
        res.json({ message: 'Product successfully added' });
    } catch(err) {
        console.log(err);
        res.json(err);
    }
});

app.get('/search', async (req, res) => {
    try {
        if(req.query.product) {
            const response = await elasticClient.search({
                index: 'products',
                q: req.query.product
            });
            if(response.body.hits.hits.length > 0) {
                return res.json({
                    total_results: response.body.hits.hits.length,
                    results: response.body.hits.hits
                });
            }
            return res.json({ message: 'Product not found!' });
        }
        res.json({ message: 'Product not found!' });
    } catch(err) {
        res.json(err);
    }
});



app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`);
});