const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId

const uri = "mongodb+srv://organicUser:y!ebKqijdNvY.4L@cluster0.onh2u.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})



client.connect(err => {
  const productCollection = client.db("organicdb").collection("products");
  //get product collection
  app.get('/products', (req, res) => {
    productCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  //post product collection
  app.post("/addProduct", (req, res) => {
    const product = req.body;
    console.log(product);
    productCollection.insertOne(product)
    .then(result => {
        console.log('One product added');
        res.redirect('/');
    });
  })
  
  //delete product collection
  app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    productCollection.deleteOne({_id: ObjectId(id)})
    .then((result) => {
      res.send(result.deletedCount > 0);
    })
  })

  app.get('/product/:id', (req, res) => {
    const id = req.params.id;
    productCollection.find({_id: ObjectId(id)})
    .toArray((err, documents) => {
      res.send(documents[0]);
    })
  })

  app.patch('/update/:id', (req, res) => {
    const id = req.params.id;
    productCollection.updateOne({_id: ObjectId(id)},
    {
      $set: {price: req.body.price, quantity: req.body.quantity}
    })
    .then(result => {
      res.send(result.modifiedCount > 0);
    })

  })

  
  
  console.log('database created')
  // client.close();
});
 

app.listen(3000); 