var express = require('express');
var router = express.Router();
var processor = require('../src/processor');
var mongojs = require('mongojs')
var monq = require('monq');
var validUrl = require('valid-url');

var db = mongojs('mongodb://localhost/md-challenge', ['jobs']);

var pattern = /^((http|https|ftp):\/\/)/;

/* POST new url to job queue */
router.post('/', function(req, res, next) {
  if(validUrl.isUri(req.body.url)) {
    processor.enqueueUrl(req.body.url, function(err, id) {
      if(!err) {
        res.status(200).send(id);
      }
      else {
        res.status(500).send(err);
      }
    });
  }
  else {
    res.status(400).send("Error: Invalid URL. Did you add http://?");
  }
});

/* GET job status, or get html if job is complete */
router.get('/status/:_id', function(req, res, next) {
    db.jobs.findOne({_id: mongojs.ObjectId(req.params._id)}, function(err, job) {
      if(!err && job) {
        if(job.status == 'complete') {
          res.status(200).send(job.result);
        }
        else {
          res.status(200).send(job.status);
        }   
      }
      else {
        res.status(400).send("No job found under that ID");
      }
      
    });
});

module.exports = router;
