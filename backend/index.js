const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

//middlewares
app.use(express.json());
app.use(cors());

//database connection
const connectDB = require("./config/Database");
connectDB();

//routes
const userRoutes = require("./routes/User");
const todoRoutes = require("./routes/Todo");
const adminRoutes = require("./routes/Admin");

app.use("/api/user", userRoutes);
app.use("/api/todo", todoRoutes);
app.use("/api/admin", adminRoutes);

//def route

app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
})

