const express = require('express');

const mongoose = require('mongoose');

const ContactData = mongoose.model('ContactData');

const router = express.Router();

router.get("/",(req,res) => {
    res.render("contactData/addOrEdit",{
        viewTitle:"Insert Contact Data"
    })
})

router.post("/",(req,res) => {
    if(req.body._id == "")
    {
    insertRecord(req,res);
    }
    else{
        updateRecord(req,res);
    }
})

function insertRecord(req,res)
{
   var contactData = new ContactData();

   contactData.email = req.body.email;

   contactData.phoneNumber = req.body.phoneNumber;

   contactData.save((err,doc) => {
       if(!err){
        res.redirect('contactData/list');
       }
       else{
          if(err.name == "ValidationError"){
              handleValidationError(err,req.body);
              res.render("contactData/addOrEdit",{
                  viewTitle:"Insert Contact Data",
                  contactData:req.body
              })
          }

          console.log("Error occured during record insertion" + err);
       }
   })
}

function updateRecord(req,res)
{
    ContactData.findOneAndUpdate({_id:req.body._id,},req.body,{new:true},(err,doc) => {
        if(!err){
            res.redirect('contactData/list');
        }
        else{
            if(err.name == "ValidationError")
            {
                handleValidationError(err,req.body);
                res.render("contactData/addOrEdit",{
                    viewTitle:'Update Contact Data',
                    contactData:req.body
                });
            }
            else{
                console.log("Error occured in Updating the records" + err);
            }
        }
    })
}

router.get('/list',(req,res) => {

    ContactData.find((err,docs) => {
        if(!err) {
            res.render("contactData/list",{
               list:docs
            })
        }
    })
})

router.get('/:id',(req,res) => {
    ContactData.findById(req.params.id,(err,doc) => {
        if(!err){
            res.render("contactData/addOrEdit",{
                viewTitle: "Update Contact Data",
                contactData: doc
            })
        }
    })
})

router.get('/delete/:id',(req,res) => {
    ContactData.findByIdAndRemove(req.params.id,(err,doc) => {
        if(!err){
            res.redirect('/contactData/list');
        }
        else{
            console.log("An error occured during the Delete Process" + err);
        }
    })
})

function handleValidationError(err,body){
    for(field in err.errors)
    {
        switch(err.errors[field].path){
        case 'email':
            body['emailError'] = err.errors[field].message;
            break;
  
        default:
           break;
        }
    }
}

module.exports = router;