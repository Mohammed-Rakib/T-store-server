const express = require('express')
const app = express()
const port = 4001
const cors = require('cors')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;

const  ObjectId  = require('mongodb').ObjectId


app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z4xqh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productSDetails = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION}`);
  const orderedProducts = client.db(`${process.env.DB_NAME}`).collection("orderedProducts");

  app.get('/products', (req, res) => {
    productSDetails.find()
    .toArray((err, products) => {
      res.send(products)
    })
  })

  app.get('/orderedProducts', (req, res) => {
    // console.log(req.query.email)
    orderedProducts.find({email: req.query.email})
    .toArray((err, products) => {
      res.send(products)
    })
  })


  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    console.log('adding new product' ,newProduct);
    productSDetails.insertOne(newProduct)
    .then(result => {
      console.log('inserted count ',result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })

  app.post('/checkOut', (req, res) => {
    const orderedProduct = req.body;
    orderedProducts.insertOne(orderedProduct)
    .then(result => {
      res.send(result.insertedCount > 0);
    })
    
  })
  

  app.delete('/delete/:id', (req, res) => {
    productSDetails.deleteOne({_id: ObjectId(req.params.id)})
    .then(( documents) => {
      console.log(documents)
    })
  })

});

app.listen(port);


  




