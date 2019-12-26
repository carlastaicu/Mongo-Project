const MongoClient = require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectID;
const dbname = "CRUD_Mongodb";
const url = "mongodb://localhost:27017"; //default location for mongodb location
const mongoOptions = {  
        useNewUrlParser: true
};

//actually create the connection between Nodejs and mongo
const state = {
    db: null
};

const connect = (cb) => {
    if(state.db) //if there is a database connection
        cb(); //actually do callback
    else{
        MongoClient.connect(url,mongoOptions,(err,client)=> {
            if(err)
                cb(err);
            else{
                state.db = client.db(dbname);
                cb();
            }
        });
    }
}

const getPrimaryKey = (_id) => {
    return ObjectID(_id); //return an object id which will be used to query the data
}

const getDB = () => {
    return state.db;
}

module.exports = {getDB,connect,getPrimaryKey};

