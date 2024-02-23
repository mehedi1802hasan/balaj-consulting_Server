const express =require('express');
const app=express();
const port =process.env.PORT || 5000;
const cors = require ('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');


app.use(express());
app.use(cors());



const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.rin8xcl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

    const blogsCollection = client.db("balaj_Consulting").collection("blogs");


    app.get('/blogs',async(req,res)=>{
        const result = await blogsCollection.find().toArray();
        res.send(result);
        console.log('result,',result)
    })
 







    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('server well going..')
})
app.listen(port,()=>{
    console.log(`server...${port}`)
})