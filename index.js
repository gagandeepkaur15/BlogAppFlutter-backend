import express from "express";
import mongoose from "mongoose";
import blogRoute from "./routes/blog_route";
import userRoute from "./routes/user_route";

const app = express();
const port = 5000 || process.env.PORT;
// const connectionString = "mongodb+srv://rootuser:Head%40ache@cluster0.3euaqvo.mongodb.net/blogDB?retryWrites=true&w=majority&appName=Cluster0"; //%40 url encode for @ symbol
const connectionString = "mongodb://0.0.0.0:27017/";

app.use(express.json());

app.get("/api", (req,res)=>{
    res.status(200).json({message: "I am running"});
})

app.use("/blog", blogRoute);
app.use("/user", userRoute);

mongoose
    .connect(connectionString) 
    .then(()=>app.listen(port))
    .then(()=>console.log(`Connected to port ${port}`));

// mongoose.connect(connectionString);
// const conn = mongoose.connection;
// conn.once('open', ()=>{
//     console.log("Connected to DB");
// })

// conn.on('error', ()=>{
//     console.log("Error connecting to DB");
//     process.exit();
// });

// app.listen(port, ()=>{
//     console.log(`Connected to port ${port}`);
// });