const express = require("express");
const app = express();
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const dotenv = require("dotenv").config();
const URL = process.env.URL;
const DB = "Student_Mentor";
app.listen(process.env.PORT || 3001);

//middleware
app.use(express.json())
app.get('/',function(req,res){
    res.json({message:"Welcome Adventure tutorial"});
})

//api for create mentor
app.post('/mentor',async function(req,res){
    try{
    const connection = await mongoClient.connect(URL);
    const db = connection.db(DB);
    await  db.collection("mentors").insertOne(req.body);
    await connection.close();
    res.json({message:"Insert the mentor Details "})
    }
    catch(error){
        res.status(500).json({message:"Sonthing Went Wrong"});
    }
})


//API for create student
app.post('/student',async function(req,res){
    try{
        const connection = await mongoClient.connect(URL);
        const db = connection.db(DB);
        await db.collection("student").insertOne(req.body);
        await connection.close();
        res.json({message:"Insert the student details"})
    }
    catch(error){
        res.status(500).json({message:"Something Went Wrong"})
    }
})

//assign one mentor for multiple students
app.post('/mentorforstudents', async function(req,res){
    try{
        const connection = await mongoClient.connect(URL);
        const db = connection.db(DB);
        const student = await db.collection("student").findById(req.params.student_id)
        student.mentors = req.params.mentor_id;
        const updatestudent = await student.save()
        await connection.close();
        res.status(200).json({message:"the student to the mentor is Assigned"})
    }
    catch(error){
        res.status(500).json({message:"Something Went Wrong"})
    }
})

//A student has a mentor should not be shown in the list
app.put('/changementor',async function(req,res){
    try{
        const connection = await mongoClient.connect(URL);
        const db = connection.db(DB);
        const student = await db.collection("student").find({mentors:req.params.student_id})
        await connection.close();
        res.status(200).json(student);
    }
    catch(error){
        res.status(500).json({message:"Something Went Wrong"})
    }
})

//Get mentor using ID
app.get('/mentordetails',async function(req,res){
    try{
        const connection = await mongoClient.connect(URL);
        const db = connection(DB);
        const mentor = await db.collection("mentor").findOne({_id:req.params.mentor_id})
        await connection.close();
        res.status(200).json(mentor);
    }
    catch(error){
        res.status(500).json({message:"Something Went Wrong"})

    }
})

//get student using ID
app.get('/studentid',async function(req,res){
    try{
        const connection = await mongoClient.connect(URL);
        const db = connection.db(DB);
        const student = await db.collection("students").findOne({_id:req.params.student_id});
        await connection.close()
        res.status(200).json(student)
    }
    catch(error){
        req.status(500).json({message:"Something Went Wrong"})
    }
})