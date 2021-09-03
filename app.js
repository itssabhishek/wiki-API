'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/wikiDB', { useNewUrlParser: true });

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model('Article', articleSchema);

/*********************************Request Targeting All the Articles **********************************/

app
  .route('/articles')
  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save(function (err, saved) {
      !err ? res.send('Saved Successfully') : res.send(err);
    });
  })
  .delete(function (req, res) {
    Article.deleteMany({}, function (err) {
      err ? res.send(err) : res.send('Successfully deleted.');
    });
  });

/*********************************Request Targeting Specific Articles **********************************/

app
  .route('/articles/:articleTitle')

  .get(function (req, res) {
    Article.findOne({ title: req.params.articleTitle }, function (found, err) {
      !err ? res.send(found) : res.send(err);
    });
  })

  .put(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      function (err) {
        !err ? res.send('Updated successfully') : res.send(err);
      }
    );
  })

  .patch(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body },
      function (err) {
        !err ? res.send('Patched successfully') : res.send(err);
      }
    );
  });

app.listen(3000, function () {
  console.log('Server started on port 3000');
});
