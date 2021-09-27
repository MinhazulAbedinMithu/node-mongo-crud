const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//send file in localhost::::::
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

//Database Connections
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.onh2u.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const uri = `mongodb+srv://root:toor@cluster0.onh2u.mongodb.net/milestone-10?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
client.connect((err) => {
	const collection = client.db("milestone-10").collection("node-mongo-crud");

	//insert data in MongoDB
	app.post("/addItem", (req, res) => {
		collection.insertOne(req.body).then((result) => {
			res.send("Success");
		});
	});

	app.get("/items", (req, res) => {
		collection.find({}).toArray((err, docs) => {
			res.send(docs);
			console.log("Items Render Success");
		});
	});

	app.get("/item/:id", (req, res) => {
		collection.find({ _id: ObjectId(req.params.id) }).toArray((err, docs) => {
			res.send(docs);
		});
	});

	app.patch("/update/:id", (req, res) => {
		collection.updateOne({ _id: ObjectId(req.params.id)},{
					$set: {
						age: req.body.updatedAge,
						study: req.body.updatedStudy,
					},
				}
			)
			.then((result) => {
				res.send(result.modifiedCount > 0);
			});
	});

	app.delete("/delete/:id", (req, res) => {
		collection.deleteOne({ _id: ObjectId(req.params.id) })
    .then((result) => {
				res.send(result.DeletedCount > 0);
			});
	});

	console.log("DB connected.");
});

//define PORT number and app listening:::
const PORT = 5000;
app.listen(PORT, (err, res) => {
	console.log(`App Listening at ${PORT}`);
});
