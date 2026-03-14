const API = "http://localhost:5000";

// USER REGISTER
async function registerUser(){

const name = document.getElementById("name").value;
const email = document.getElementById("email").value;
const phone = document.getElementById("phone").value;
const password = document.getElementById("password").value;

await fetch(API + "/api/users/register",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
name,
email,
phone,
password
})

});

alert("User Registered");
window.location="login.html";

}


// VOLUNTEER REGISTER
async function registerVolunteer(){

const name=document.getElementById("name").value;
const email=document.getElementById("email").value;
const phone=document.getElementById("phone").value;
const password=document.getElementById("password").value;

navigator.geolocation.getCurrentPosition(async position=>{

const lat=position.coords.latitude;
const lng=position.coords.longitude;

await fetch(API + "/api/volunteers/register",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

name,
email,
phone,
password,

location:{
lat,
lng
}

})

});

alert("Volunteer Registered");

});

}


// USER LOGIN
async function loginUser(){

const email=document.getElementById("email").value;
const password=document.getElementById("password").value;

await fetch(API + "/api/users/login",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
email,
password
})

});

window.location="user-dashboard.html";

}


// VOLUNTEER LOGIN
async function loginVolunteer(){

const email=document.getElementById("email").value;
const password=document.getElementById("password").value;

await fetch(API + "/api/volunteers/login",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
email,
password
})

});

window.location="volunteer-dashboard.html";

}


// CREATE HELP REQUEST
async function createRequest(){

const description=document.getElementById("description").value;

navigator.geolocation.getCurrentPosition(async position=>{

const lat=position.coords.latitude;
const lng=position.coords.longitude;

await fetch(API + "/api/requests/create",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

description,

location:{
lat,
lng
}

})

});

alert("Help request created");

});

}


// MAP FOR VOLUNTEER
function loadMap(){

navigator.geolocation.getCurrentPosition(async position=>{

const lat=position.coords.latitude;
const lng=position.coords.longitude;

const map=L.map('map').setView([lat,lng],13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
maxZoom:19
}).addTo(map);

const res=await fetch(API + "/api/requests/all");

const data=await res.json();

data.forEach(r=>{

if(r.location){

L.marker([r.location.lat,r.location.lng])
.addTo(map)
.bindPopup(r.description);

}

});

});

}