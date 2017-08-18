var monq = require('monq');
var client = monq('mongodb://localhost/md-challenge');
var rp = require('request-promise');
var Worker = require('./Worker');

var queue = client.queue('jobQueue');

var workerList = []
const WORKER_COUNT = 4; // Number of workers you want to run concurrently

/*
  Adds the URL (and several background attributes) to MongoDB
  and returns the ObjectId for reference
*/
exports.enqueueUrl = function(m_url, callback) {
  queue.enqueue('processURL', {
    url: m_url
  }, function(err, job) {
    return callback(null, job.data._id);
  });
}

/* 
  Defines the function that a worker will perform
  In this case, all workers will get HTML from a URL
*/
var processURL = {
  processURL: function(params, callback) {
    try {
      return rp.get(params.url)
        .then(function(htmlString) {
          callback(null, htmlString);
        })
        .catch(function(err) {
          callback(err);
        });
    } catch (err) {
      callback(err);
    }
  }
}

/*
  Instantiates ands starts all workers
  Each workers options can be easily accessed via the workerList array
*/
for(var i = 0; i < WORKER_COUNT; i += 1) {
  workerList[i] = new Worker(processURL, i);
}
