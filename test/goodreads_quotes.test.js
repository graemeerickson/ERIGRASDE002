const expect = require('chai').expect;
const request = require('request');
const app = require('../goodreads_quotes');

const GOODREADS_QUOTES_URL = 'https://www.goodreads.com/author/quotes/1244.Mark_Twain';


// todo: test user auth response


// test goodreads response
describe('Goodreads quotes response', function() {
  it('should return a 200 response', function(done) {
    request(GOODREADS_QUOTES_URL, (err, res, body) => {
      expect(res.statusCode).to.equal(200);
      done();
    })
  }).timeout(4000);  // set timeout to 4000ms due to sometime delayed response from goodreads
})

// todo: test quotes output file results
