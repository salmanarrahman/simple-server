require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

const cors = require('cors');

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://ums:1234@cluster0.0hkzjzr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db('bookworm');
    const productCollection = db.collection('product');
    const userCollection = db.collection('user');


    app.get('/book', async (req, res) => {
      const cursor = productCollection.find({});
      const product = await cursor.toArray();

      res.send({ status: true, data: product });
    });

    app.post('/book', async (req, res) => {
      const product = req.body;

      const result = await productCollection.insertOne(product);

      res.send(result);
    });

    app.get('/book/:id', async (req, res) => {
      const id = req.params.id;

      const result = await productCollection.findOne({ _id: ObjectId(id) });
      res.send(result);
    });

    app.delete('/book/:id', async (req, res) => {
      const id = req.params.id;

      const result = await productCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });

    //add email in product
    app.post('/book/add/:id', async (req, res) => {
      const productId = req.params.id;
      const email = req.body.email;

     

      const result = await productCollection.updateOne(
        { _id: ObjectId(productId) },
        { $push: { emails: email } }
      );


      if (result.modifiedCount !== 1) {
        console.error('Product not found or comment not added');
        res.json({ error: 'Product not found or comment not added' });
        return;
      }

      console.log('Comment added successfully');
      res.json({ message: 'Comment added successfully' });
    });
    //update
    app.post('/book/update/:id', async (req, res) => {
      const id = req.params.id;
      const data = req.body;

       console.log(data);
       console.log(id);

      const result = await productCollection.updateOne(
        { _id: ObjectId(id) }
        ,
        { $set: data }
      );

      console.log(result);

      if (result.modifiedCount !== 1) {
        console.error('book not added');
        res.json({ error: 'book not added' });
        return;
      }

      console.log('updated successfully');
      res.json({ message: 'updated successfully' });
    });
//getProduct by email
    app.get('/book/:email', async (req, res) => {
      const email = req.params.email;


      const result = await productCollection.find(
        {  email:email }
      );

      console.log();

      if (result.modifiedCount !== 1) {
        console.error('Product not found or comment not added');
        res.json({ error: 'Product not found or comment not added' });
        return;
      }

      console.log('product added successfully');
      res.json({ message: 'product added successfully' });
    });

    app.post('/comment/:id', async (req, res) => {
      const productId = req.params.id;
      const comment = req.body.comment;

  

      const result = await productCollection.updateOne(
        { _id: ObjectId(productId) },
        { $push: { comments: comment } }
      );


      if (result.modifiedCount !== 1) {
        console.error('Product not found or comment not added');
        res.json({ error: 'Product not found or comment not added' });
        return;
      }

      console.log('Comment added successfully');
      res.json({ message: 'Comment added successfully' });
    });

    app.get('/comment/:id', async (req, res) => {
      const productId = req.params.id;

      const result = await productCollection.findOne(
        { _id: ObjectId(productId) },
        { projection: { _id: 0, comments: 1 } }
      );

      if (result) {
        res.json(result);
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    });

    app.post('/user', async (req, res) => {
      const user = req.body;

      const result = await userCollection.insertOne(user);

      res.send(result);
    });

    app.post('/user/login', async (req, res) => {
      const email = req.body.email;
      const password = req.body.password

      const result = await userCollection.findOne({ email,password });

      if (result?.email) {
        return res.send({ status: true, data: result });
      }

      res.send({ status: false });
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`api is listening on port ${port}`);
});
