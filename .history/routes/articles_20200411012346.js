
const express = require('express');
const router = express.Router();

// Bring in Articles Models
let Article = require('../models/article');
//User model
let User = require('../models/user');

// Add Route
router.get('/add', ensureAuthenticated,function(req,res){
  res.render('add_article',{
    title:'Add Articles'
  });
});
// Add Route
router.get('/ourteam',function(req,res){
  res.render('our_team',{
    title:'Our Team'
  });
});

router.get('/profile', ensureAuthenticated,function(req,res){
  res.render('profile',{
    title:'Profile'
  });
});


//Add Sumit Post Route
router.post('/add',function(req, res){
  req.checkBody('title','Title is require').notEmpty();
  //req.checkBody('author','Author is require').notEmpty();
  req.checkBody('body','Body is require').notEmpty();

  //Get errors
  let errors =req.validationErrors();

  if(errors){
    res.render('add_article',{
      title: 'Add Article',
      errors:errors
    });
  }else{
    let article = new Article();
    article.title = req.body.title;
    article.author = req.user._id;
    article.body = req.body.body;

    article.save(function(err){
      if(err){
        console.log(err);
        return;
      }else{
        req.flash('success','Article Added');
        res.redirect('/');
      }
    });
  }
});

//Load Edit Add Form
router.get('/edit/:id', ensureAuthenticated, function(req,res){
  Article.findById(req.params.id,function(arr,article){
    if(article.author != req.user._id){
    req.flash('danger', 'Not Authorized');
    return res.redirect('/');
    }
    res.render('edit_article',{
      title: 'Edit Article',
      article: article
    });
  });
});

//Load Edit Profile Form
router.get('/editpp/:id', ensureAuthenticated, function(req,res){
  User.findById(req.params.id,function(arr,article){
    if(user._id != req.article.author){
    req.flash('danger', 'Not Authorized');
    return res.redirect('/');
    }
    res.render('edit_profile',{
      title: 'Edit Profile'

    });
  });
});

//Update Sumit Post Route
router.post('/editpp/:id',function(req, res){
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query ={_id:req.params.id}

  Article.update(query, article,function(err){
    if(err){
      console.log(err);
      return;
    }else{
      req.flash('success','Article Updated');
      res.redirect('/');
    }
  });
});
//Update Sumit Post Route
router.post('/edit/:id',function(req, res){
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query ={_id:req.params.id}

  Article.update(query, article,function(err){
    if(err){
      console.log(err);
      return;
    }else{
      req.flash('success','Article Updated');
      res.redirect('/');
    }
  });
});
// Delete Article
router.delete('/:id', function(req, res){
  if(!req.user._id){
    res.status(500).send();
  }

  let query = {_id:req.params.id}

  Article.findById(req.params.id, function(err, article){
    if(article.author != req.user._id){
      res.status(500).send();
    } else {
      Article.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
    }
  });
});

//Get Single Article
router.get('/:id', function(req,res){
  Article.findById(req.params.id,function(arr,article){
    User.findById(article.author, function(err,user){
      res.render('article',{
        article: article,
        author: user.name
      });
    });
  });
});

// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

// MongoDB Atlas connection setting
const mongoose = require('mongoose')
const connStr = process.env.DATABASE_URL
                      .replace('<password>',process.env.DATABASE_PWD)
                      .replace('<database>',process.env.DATABASE_NAME)


mongoose.connect(connStr, { useNewUrlParser: true,
                            useUnifiedTopology: true,
                            useFindAndModify: false,
                            useCreateIndex: true })
const db = mongoose.connection
db.on('error', () => console.log('Database connection error'))
db.once('open', () => console.log('Database connected'))

module.exports =router;
