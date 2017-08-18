# MD-Challenge

`"Create a job queue whose workers fetch data from a URL and store the results in a database. The job queue should expose a REST API for adding jobs and checking their status / results."`

### Prerequisites

Before you can run this, you need a local running MongoDB instance.

### Installing

```
git clone https://github.com/austinthiel/MD-Challenge.git
cd MD-Challenge
npm install
npm start
```

## POST : /jobs

### Body Parameters
- **url** _(required)_ — URL of the page to be parsed.

### Return format
A response with key "status" and value of 200, and the Mongo ObjectID string referencing where the document is stored.

## GET : /jobs/status/:_id

### URL Parameters
- **_id** _(required)_ — The Mongo ObjectID string given to you via the `/jobs` POST request

### Return format
A response with key "status" and value of 200, and one of the following:

- **"enqueued"** — The job has been added to the queue.
- **"dequeued"** — The job was dequeued by a worker for processing. If the URL is invalid or otherwise unable to be processed, the job                      will remain in this state.
- **The HTML String** — If the job has been successfully completed by a worker, this endpoint will return the HTML string that was                               fetched.


## Built With

* [Monq](https://github.com/scttnlsn/monq) - The heavy lifting for queue operations
* [Express Generator](https://expressjs.com/en/starter/generator.html) - The application skeleton
* [MongoDB](https://www.mongodb.com/) - The database of course!
