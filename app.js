const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const app = express()
const port = 3000

mongoose.connect('mongodb://localhost:27017/wikiDB');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model('Article', articleSchema);

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.route('/articles')
    .get((req, res)=>{
        Article.find({}, (err, result)=>{
            if(!err){
                res.send(result);
            }else{
                res.send(err);
            }
        });
    })
    .post((req,res)=>{
        const newArticle = new Article({
            title : req.body.title,
            content : req.body.content
        });
        Article.count({title: req.body.title}, (err, count)=>{
            if(!err){
                if(count == 0) {
                    newArticle.save();
                    res.send("Successfully added a new article.")
                }else{
                    res.send("Title already exist!");
                }
            }else{
                res.send(err)
            }
        });
    })
    .delete((req,res)=>{
        Article.deleteMany((err)=>{
            if(!err){
                res.send("Deleted all documents.");
            }else{
                res.send(err);
            }
        });
    });

    app.route('/articles/:articleTitle')
    .get((req, res)=>{
        Article.findOne({title: req.params.articleTitle}, (err, result)=>{
            if(result){
                if(!err){
                    res.send(result);
                }else{
                    res.send(err);
                }
            }else{
                res.send("No articles matching that title was found.");
            }
        });
    })
    .put((req, res)=>{
        Article.findOneAndUpdate({title: req.params.articleTitle}, {title:req.body.title, content: req.body.content}, {overwrite: true},(err, doc)=>{
            if(!err){
                res.send("Succesfully replaced article.");
            }else{
                res.send(err);
            }
        });
    })
    .patch((req, res)=>{
        Article.findOneAndUpdate({title: req.params.articleTitle}, {title:req.body.title, content: req.body.content}, (err, doc)=>{
            if(!err){
                res.send("Succesfully updated article.");
            }else{
                res.send(err);
            }
        });
    })
    .delete((req, res)=>{
        Article.findOneAndDelete({title: req.params.articleTitle}, (err)=>{
            if(!err){
                res.send("Succesfully delted article");
            }else{
                res.send(err);
            }
        });
    });

app.listen(port, () => {
  console.log(`Wiki-API listening at http://localhost:${port}`)
})