const { Client } = require('@elastic/elasticsearch');
const elasticClient = new Client({ node: 'http://localhost:9200' });
const faker = require('@faker-js/faker');
const { v4: uuid } = require('uuid');

let data = [];

async function Product() {
    try {
        for(let i = 0; i < 100; i++) {
            const random5 = Math.floor(Math.random() * 6);
            const postData = {
                id: uuid(),
                title: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                location: `${faker.address.city()}, ${faker.address.state()} - ${faker.address.zipCode()}`,
                price: faker.commerce.price(),
                avgRating: random5,
                seller: { 
                    name: faker.internet.userName(),
                    contact: faker.phone.phoneNumber()
                },
                images: [
                    {
                        url: faker.image.imageUrl()
                    },
                    {
                        url: faker.image.imageUrl()
                    },
                    {
                        url: faker.image.imageUrl()
                    },
                    {
                        url: faker.image.imageUrl()
                    }
                ]
            }
            await elasticClient.index({
                index: 'products',
                body: postData
            });
            data.push(postData);
        }
        return data;
    } catch(err) {
        return err;
    }
}

module.exports = { Product, data };