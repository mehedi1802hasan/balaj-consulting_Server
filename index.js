const express =require('express');
const app=express();
const port =process.env.PORT || 5000;
const cors = require ('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');


app.use(express.json());
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
    const usersCollection = client.db("balaj_Consulting").collection("users");


    app.get('/blogs',async(req,res)=>{
        const result = await blogsCollection.find().toArray();
        res.send(result);
        console.log('result,',result)
    })
    app.post ('/blogs',async(req,res)=>{
           const blog=req.body;
           const result =await blogsCollection.insertOne(blog);
           res.send(result)
           console.log(result)
       })

       // delete id ways blogs
      //  app.delete('/books/:id',async(req,res)=>{
      //   const id = req.params.id;
      //       const query = { _id: new ObjectId(id)};
      //       const result = await booksCollections.deleteOne(query);
      //     console.log(result)
      //       res.send(result);
      //  })
         

      app.delete('/blogs/:id',async(req,res)=>{
        const id =req.params.id;
        const query = { _id: new ObjectId(id)};
        const result =await blogsCollection.deleteOne(query);
        console.log('dlete..',result);
        res.send(result)
      })
    

      /// blog id ways Edit ..
      // image,title,subtitle, authorImage, authorName,profession
      app.put('/blogs/:id', async (req, res) => {
        const id = req.params.id;
        const body = req.body;
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
            $set: {
                image: body.image,
                title: body.title,
                subtitle: body.subtitle,
                authorImage: body.authorImage,
                authorName: body.authorName,
                profession: body.profession,
            },
        };
        const result = await blogsCollection.updateOne(filter, updateDoc);
        console.log(result)
        res.send(result);
    });
      
    app.get('/users',async(req,res)=>{
      const result = await usersCollection.find().toArray();
      res.send(result);
      console.log('result,',result)
  })

  // app.post('/jwt',(req,res)=>{
  //   const user=req.body;
  //   const token =jwt.sign(user,process.env.ACCSS_TOKEN_SECRET,{expiresIn:'1h'});
  //   res.send({token})
  // })

    // app.post('/users', async (req, res) => {

    //   const user = req.body;
    //   console.log(user);
    //   const query = { email: user.email };
    //   const existingUser = await usersCollection.findOne(query);
    //   console.log('existing User', existingUser);
    //   if (existingUser) {
    //     return res.send({ message: 'User already exists' });
    //   }
    //   const result = await usersCollection.insertOne(user);
    //   res.send(result);
    
    
    // });
     
 
   

    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log('user..',user);
      const query = { email: user.email };
      const existingUser = await usersCollection.findOne(query);
      console.log('existing user', existingUser);
      if (existingUser) {
        return res.send({ Message: 'user already exists' });
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

//  app.post ('/users',async(req,res)=>{
//      const user=req.body;
//      const result =await usersCollection.insertOne(user);
//      res.send(resu)
//  })

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