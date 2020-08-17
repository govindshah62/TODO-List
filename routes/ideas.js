const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Idea = require('../database/models/Idea');
const {ensureAuth}= require('../middleware/auth');


router.get('/',ensureAuth, (req, res) => {
    Idea.find({user:req.user.id}).lean()
      .sort({date:'desc'})
      .then(ideas => {
        res.render('ideas/index', {
          ideas:ideas
        });
      });
});
  
router.get('/add',ensureAuth, (req,res)=>{
      res.render('ideas/add');
});
  
router.get('/edit/:id',ensureAuth, (req, res) => {
      Idea.findOne({
        _id: req.params.id
      }).lean()
      .then(idea => {
        if(idea.user!=req.user.id){
          req.render('/ideas')
        }else{
          res.render('ideas/edit', {
            idea:idea
          });
        }       
      });
});
  
  
  
router.post('/',ensureAuth, async (req, res) => {
    let errors = [];
    
    if(!req.body.title){
      errors.push({text:'Please add a title'});
    }
    if(!req.body.details){
      errors.push({text:'Please add some details'});
    }
    
    if(errors.length > 0){
      res.render('ideas/add', {
        errors: errors,
        title: req.body.title,
        details: req.body.details
      });
    }else{
      const newUser = {
        title: req.body.title,
        details: req.body.details,
        user: req.user.id
      }
      await Idea.create(newUser);
      res.redirect('/ideas');
    }
});
  
router.put('/:id',ensureAuth,(req,res)=>{
    Idea.findOne({
      _id:req.params.id
    })
      .then(idea=>{
        idea.title= req.body.title;
        idea.details = req.body.details;
        idea.save({
          new:true,
          runValidators:true
        });
      })
      .then(idea=>{
        res.redirect('/ideas');
      })
  
});
  
router.delete('/:id', ensureAuth,(req, res) => {
    Idea.deleteOne({_id: req.params.id})
      .then(() => {
        res.redirect('/ideas');
      });
});

module.exports = router;