var monq = require('monq');
var client = monq('mongodb://localhost/md-challenge');

/*
  NOTE: If queue is empty => Workers poll for new jobs every 5000ms

  Otherwise, workers complete available jobs as quickly as possible until 
  the queue is empty
*/

module.exports = class Worker {
  
  constructor(task, workerId) {
    this.worker = client.worker(['jobQueue']);

    this.task = task;
    this.workerId = workerId;

    this.worker.register(task);
    this.worker.start();

    this.worker.on('dequeued', function (data) {
      // console.log('Worker Start:', workerId);
    });

    this.worker.on('complete', function (data) {
      console.log('Worker Done:', workerId);
    });

    this.worker.on('failed', function (data) {
      console.log('Worker Failed:', workerId);
    });
  }
}
