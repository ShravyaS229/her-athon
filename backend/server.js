const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());

/* ===============================
   MongoDB Connection
================================ */

mongoose.connect(
"mongodb+srv://shravyahurpaje_db_user:ldMI8HiPPqVZ5Wt8@cluster0.wvrnygw.mongodb.net/helpapp?retryWrites=true&w=majority"
)
.then(()=>{
    console.log("MongoDB Connected");

    app.listen(5000,()=>{
        console.log("Server running on port 5000");
    });

})
.catch(err=>console.log(err));


/* ===============================
   DATABASE SCHEMAS
================================ */

// USER
const UserSchema = new mongoose.Schema({
    name:String,
    email:{type:String,unique:true},
    password:String,
    phone:String
});

const User = mongoose.model("User",UserSchema);


// VOLUNTEER
const VolunteerSchema = new mongoose.Schema({
    name:String,
    email:{type:String,unique:true},
    password:String,
    phone:String,
    location:{
        lat:Number,
        lng:Number
    }
});

const Volunteer = mongoose.model("Volunteer",VolunteerSchema);


// HELP REQUEST
const RequestSchema = new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    description:String,

    location:{
        lat:Number,
        lng:Number
    },

    status:{
        type:String,
        default:"pending"
    },

    volunteerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Volunteer"
    },

    createdAt:{
        type:Date,
        default:Date.now
    }

});

const Request = mongoose.model("Request",RequestSchema);


/* ===============================
   TEST ROUTE
================================ */

app.get("/",(req,res)=>{
    res.send("Backend running successfully");
});


/* ===============================
   USER ROUTES
================================ */

// Register User
app.post("/api/users/register", async (req,res)=>{

    try{

        const hashedPassword = await bcrypt.hash(req.body.password,10);

        const user = new User({
            name:req.body.name,
            email:req.body.email,
            password:hashedPassword,
            phone:req.body.phone
        });

        await user.save();

        res.json(user);

    }catch(err){
        res.status(500).json(err);
    }

});


// Login User
app.post("/api/users/login", async (req,res)=>{

    try{

        const user = await User.findOne({email:req.body.email});

        if(!user){
            return res.status(404).json("User not found");
        }

        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if(!validPassword){
            return res.status(400).json("Invalid password");
        }

        res.json(user);

    }catch(err){
        res.status(500).json(err);
    }

});


/* ===============================
   VOLUNTEER ROUTES
================================ */

// Register Volunteer
app.post("/api/volunteers/register", async (req,res)=>{

    try{

        const hashedPassword = await bcrypt.hash(req.body.password,10);

        const volunteer = new Volunteer({
            name:req.body.name,
            email:req.body.email,
            password:hashedPassword,
            phone:req.body.phone,
            location:req.body.location
        });

        await volunteer.save();

        res.json(volunteer);

    }catch(err){
        res.status(500).json(err);
    }

});


// Login Volunteer
app.post("/api/volunteers/login", async (req,res)=>{

    try{

        const volunteer = await Volunteer.findOne({email:req.body.email});

        if(!volunteer){
            return res.status(404).json("Volunteer not found");
        }

        const validPassword = await bcrypt.compare(
            req.body.password,
            volunteer.password
        );

        if(!validPassword){
            return res.status(400).json("Invalid password");
        }

        res.json(volunteer);

    }catch(err){
        res.status(500).json(err);
    }

});


/* ===============================
   HELP REQUEST ROUTES
================================ */

// Create Request
app.post("/api/requests/create", async (req,res)=>{

    try{

        const request = new Request(req.body);

        await request.save();

        res.json(request);

    }catch(err){
        res.status(500).json(err);
    }

});


// Get All Requests
app.get("/api/requests/all", async (req,res)=>{

    try{

        const requests = await Request.find();

        res.json(requests);

    }catch(err){
        res.status(500).json(err);
    }

});


// Accept Request
app.post("/api/requests/accept/:id", async (req,res)=>{

    try{

        const request = await Request.findByIdAndUpdate(
            req.params.id,
            {
                status:"accepted",
                volunteerId:req.body.volunteerId
            },
            {new:true}
        );

        res.json(request);

    }catch(err){
        res.status(500).json(err);
    }

});


// Complete Request
app.post("/api/requests/complete/:id", async (req,res)=>{

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


/* ===============================
   NEARBY REQUESTS (MAP FEATURE)
================================ */

app.get("/api/requests/nearby", async (req,res)=>{

    try{

        const lat = parseFloat(req.query.lat);
        const lng = parseFloat(req.query.lng);

        const requests = await Request.find({
            status:"pending"
        });

        const nearbyRequests = requests.filter(r => {

            if(!r.location) return false;

            const distance = Math.sqrt(
                Math.pow(r.location.lat - lat,2) +
                Math.pow(r.location.lng - lng,2)
            );

            return distance < 0.05;
        });

        res.json(nearbyRequests);

    }catch(err){
        res.status(500).json(err);
    }

});