const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//TODO

mongoose.connect("mongodb://localhost:27017/wikiDB" , {useNewUrlParser:true, useUnifiedTopology:true})

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model('Article', articleSchema)

// instead of app.get, app.post, app.delete for same "/articles"
// we can instead use express routing to code less 
// Eg  app.route('/articles').get().post().delete()
// get() ka function uske andar daaldo and do this for al



/////////////////// REQUESTS FOR ALL ARTICLES /////////////////////////////////
app.route('/articles')
.get(function(req,res){
    Article.find({ }, function(err, foundArticles){
        if(!err)
        {
            res.send(foundArticles)
        }
        else {
            res.send(err)
        }
       
    })
})
.post(function(req, res){
    console.log(req.body.title)
    console.log(req.body.content)
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    })
    newArticle.save(function(err){
        if(!err)
        {
            res.send('Successfully added the new article')
        }
        else {
            res.send(err)
        }
    })
})
.delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err)
        {
            res.send("Successfully deleted")
        }
        else {
            res.send(err)
        }
    })
});



///////////////////////////  REQUESTS FOR SPECIFIC ARTICLES ////////////////////////////////

app.route('/articles/:articleTitle')
.get(function(req, res){
    Article.findOne({
        title: req.params.articleTitle
    }, function(err, foundArticle){
        if(foundArticle){
            res.send(foundArticle)
        }
        else {
            res.send("No matching aricle found")
        }

    })
})
// if PUT mein we provide only 1 field then other field gets deleted and the provided field gets updated
.put(function(req, res){
    Article.update({
        // which article to update
        title: req.params.articleTitle
    } , {
        // what to update
        title: req.body.title,
        content: req.body.content
    } , {overwrite: true}, 
    function(err){
        if(!err)
        {
            res.send("Succssfully updated the artice")
        }
        else {
            res.send(err)
        }
    })
})
// to update only a particular field, PATCH is better than PUT
// see the documentation for patch about uts syntax
.patch(function(req, res){
    Article.update({title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err)
            {
                res.send("SUCCESSFULLY UPDATED THE ARTICLE")
            }
            else{
                res.send(err)
            }
        })
})
.delete(function(req, res){
    Article.deleteOne({title: req.params.articleTitle}, 
        function(err){
            if(!err)
            {
                res.send("Deleted the article successfully")
            }
            else {
                res.send(err)
            }
        })
})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
