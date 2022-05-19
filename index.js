const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// MongoDB
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7gneyjs.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        await client.connect();
        console.log("db connected");
        const taskCollection = client.db("toDoApp").collection("tasks");

        // get tasks of user
        app.get("/task/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const tasks = await taskCollection.find(query).toArray();
            res.send(tasks);
        });

        // add a task
        app.post("/task", async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result);
        });

        // delete a task 
        app.delete("/task/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        })

        // completed style add
        app.put("/task/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const style = req.body;
            const options = { upsert: true };
            const updateDoc = {
                $set: style,
            };
            const result = await taskCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });
    } finally {
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Simple to do server is up and running");
});

app.get("/herokuTest", (req, res) => {
    res.send("Working properly")
})

app.listen(port, () => {
    console.log("Listening to simple to do at port,", port);
});
