const express = require('express');

const mongoose = require('mongoose');

const CEO = mongoose.model('CEO');

const router = express.Router();

router.get("/",(req,res) => {
    res.render("ceo/addOrEdit",{
        viewTitle:"Insert CEO"
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
   var ceo = new CEO();

   ceo.name = req.body.name;

   ceo.cityOfBirth = req.body.cityOfBirth;

   ceo.yearsInOffice = req.body.yearsInOffice;

   ceo.netWorth = req.body.netWorth;

   ceo.save((err,doc) => {
       if(!err){
        res.redirect('ceo/list');
       }
       else{
           
          if(err.name == "ValidationError"){
              handleValidationError(err,req.body);
              res.render("ceo/addOrEdit",{
                  viewTitle:"Insert CEO",
                  ceo:req.body
              })
          }

          console.log("Error occured during record insertion" + err);
       }
   })
}

function updateRecord(req,res)
{
    CEO.findOneAndUpdate({_id:req.body._id,},req.body,{new:true},(err,doc) => {
        if(!err){
            res.redirect('ceo/list');
        }
        else{
            if(err.name == "ValidationError")
            {
                handleValidationError(err,req.body);
                res.render("ceo/addOrEdit",{
                    viewTitle:'Update CEO',
                    ceo:req.body
                });
            }
            else{
                console.log("Error occured in Updating the records" + err);
            }
        }
    })
}

router.get('/list',(req,res) => {

    CEO.find((err,docs) => {
        if(!err) {
            res.render("ceo/list",{
               list:docs
            })
        }
    })
})

router.get('/:id',(req,res) => {
    CEO.findById(req.params.id,(err,doc) => {
        if(!err){
            res.render("ceo/addOrEdit",{
                viewTitle: "Update CEO",
                ceo: doc
            })
        }
    })
})

router.get('/delete/:id',(req,res) => {
    CEO.findByIdAndRemove(req.params.id,(err,doc) => {
        if(!err){
            res.redirect('/ceo/list');
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
        case 'name':
              body['nameError'] = err.errors[field].message;
              break;
        default:
           break;
        }
    }
}

module.exports = router;