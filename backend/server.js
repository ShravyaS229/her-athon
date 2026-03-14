const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Request = require("./request");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://shravyahurpaje_db_user:ldMI8HiPPqVZ5Wt8@cluster0.wvrnygw.mongodb.net/helpapp?retryWrites=true&w=majority")
.then(()=>{
    console.log("MongoDB Connected");

    app.listen(5000, ()=>{
        console.log("Server running on port 5000");
    });
})
.catch(err=>console.log(err));


// Test route
app.get("/",(req,res)=>{
    res.send("Backend running");
});


// Create request
app.post("/api/request", async (req,res)=>{
    try{
        const request = new Request(req.body);
        await request.save();
        res.json(request);
    }catch(err){
        res.status(500).json(err);
    }
});


// Get all requests
app.get("/api/requests", async (req,res)=>{
    try{
        const requests = await Request.find();
        res.json(requests);
    }catch(err){
        res.status(500).json(err);
    }
});


// Accept request
app.post("/api/request/accept/:id", async (req,res)=>{
    try{
        const request = await Request.findByIdAndUpdate(
            req.params.id,
            {status:"accepted"},
            {new:true}
        );
        res.json(request);
    }catch(err){
        res.status(500).json(err);
    }
});


// Complete request
app.post("/api/request/complete/:id", async (req,res)=>{
    try{
        const request = await Request.findByIdAndUpdate(
            req.params.id,
            {status:"completed"},
            {new:true}
        );
        res.json(request);
    }catch(err){
        res.status(500).json(err);
    }
});