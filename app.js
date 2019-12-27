const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');
const Joi = require('joi'); //for user validation

const app = express();
//schema = blueprint that an object has to follow
app.use(bodyParser.json()); //we are parsing json data from the client to the database

const db = require("./db");
const collection = "todo"; //name of the collection
//we can have multiple collections

const schema = Joi.object().keys({
    todo : Joi.string().required() //this schema is assuring that the string is not empty
});

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname, 'index.html'));
});

//query all
app.get('/getTodos',(req,res)=>{
    db.getDB().collection(collection).find({}).toArray((err,documents)=>{
        if(err)
            console.log(err);
        else{
            res.json(documents);
        }
    }); //it will return the database collecttion TODOs
})

//update the data
app.put('/:id',(req,res)=>{
    const todoID = req.params.id;
    const userInput = req.body;
    db.getDB().collection(collection).findOneAndUpdate({_id : db.getPrimaryKey(todoID)},{$set : {todo : userInput.todo}},{returnOriginal : false},(err,result)=>{
        if(err)
            console.log(err)
        else{
            res.json(result); //send back data in json form
        }
    });
});

//create
app.post('/',(req,res,next)=>{
    // Document to be inserted
    const userInput = req.body;

    // Validate document
    // If document is invalid pass to error middleware
    // else insert document within todo collection
    Joi.validate(userInput,schema,(err,result)=>{
        if(err){
            const error = new Error("Invalid Input");
            error.status = 400;
            next(error);
        }
        else{
            db.getDB().collection(collection).insertOne(userInput,(err,result)=>{
                if(err){
                    const error = new Error("Failed to insert Todo Document");
                    error.status = 400;
                    next(error);
                }
                else
                    res.json({result : result, document : result.ops[0],msg : "Successfully inserted Todo!!!",error : null});
            });
        }
    })    
});

//delete
app.delete('/:id', (req, res) => { //using a route parameter we get the id of what is to be deleted
    const todoID = req.params.id;

    db.getDB().collection(collection).findOneAndDelete({_id : db.getPrimaryKey(todoID)}, (err, result)=> {
        if(err)
            console.log(err);
        else {
            res.json(result);
        }
    });
});

db.connect((err)=>{
    if(err) {
        console.log(err)
        console.log('unable to connect to database');
        process.exit(1);
    }
    else {
        app.listen(3000,()=>{
            console.log('connected to database, app listening on port 3000');
        });
    }
});
