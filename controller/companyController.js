const express = require('express');

const mongoose = require('mongoose');

const Company = mongoose.model('Company');
const Headquarter = mongoose.model('Headquarter');
const CEO = mongoose.model('CEO');
const ContactData = mongoose.model('ContactData');

const router = express.Router();

router.get("/",(req,res) => {
    res.render("company/addOrEdit",{
        viewTitle:"Insert Company"
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
   var company = new Company();

   company.name = req.body.name;

   company.headquarter = req.body.headquarter;

   company.stockMarketPrice = req.body.stockMarketPrice;

   company.contactData = req.body.contactData;

   company.ceo = req.body.ceo;

   Headquarter.findOne({name: company.headquarter}, (errHeadquarter, headquarter) => {
    ContactData.findOne({email: company.contactData}, (errContact, contactData) => {
      CEO.findOne({name: company.ceo}, (errCEO, ceo) => {
         if(headquarter == null || contactData == null || ceo == null){
             handleReferenceError(req.body, headquarter, contactData, ceo);
             res.render("company/addOrEdit",{
                 viewTitle:"Insert Company",
                 company:req.body
             });
         }
         else {
             company.save((err,doc) => {
                 if(!err){
                     res.redirect('company/list');
                 }
                 else{
                     if(err.name == "ValidationError"){
                         handleValidationError(err,req.body);
                         res.render("company/addOrEdit",{
                             viewTitle:"Insert Company",
                             company:req.body
                         })
                     }
                     console.log("Error occured during record insertion" + err);
                 }
             })
         }
    })
    })
    })
}

function updateRecord(req,res)
{
    Company.findOneAndUpdate({_id:req.body._id,},req.body,{new:true},(err,doc) => {
        if(!err){
            res.redirect('company/list');
        }
        else{
            if(err.name == "ValidationError")
            {
                handleValidationError(err,req.body);
                res.render("company/addOrEdit",{
                    viewTitle:'Update Company',
                    company:req.body
                });
            }
            else{
                console.log("Error occured in Updating the records" + err);
            }
        }
    })
}

router.get('/list',(req,res) => {

    Company.find((err,docs) => {
        if(!err) {
            res.render("company/list",{
               list:docs
            })
        }
    })
})

router.get('/:id',(req,res) => {
    Company.findById(req.params.id,(err,doc) => {
        if(!err){
            res.render("company/addOrEdit",{
                viewTitle: "Update Company",
                company: doc
            })
        }
    })
})

router.get('/delete/:id',(req,res) => {
    Company.findByIdAndRemove(req.params.id,(err,doc) => {
        if(!err){
            res.redirect('/company/list');
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

function handleReferenceError(body, headquarter, contactData, ceo){
    if(headquarter == null)
        body['headquarterError'] = "Headquarter does not exist";
    if(contactData == null)
        body['contactDataError'] = "Contact Data does not exist";
    if(ceo == null)
        body['ceoError'] = "CEO does not exist";
}

module.exports = router;