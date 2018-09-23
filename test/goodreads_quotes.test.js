const chai = require('chai')
const chaiFiles = require('chai-files');
const expect = require('chai').expect;
const file = chaiFiles.file;
const fs = require('fs');
const request = require('request');
const app = require('../goodreads_quotes');

chai.use(chaiFiles);

const GOODREADS_QUOTES_URL = 'https://www.goodreads.com/author/quotes/1244.Mark_Twain';

// todo: test user auth response


// test goodreads response at the Mark Twain quotes page url
describe('Goodreads quotes response', function() {
  it('should return a 200 response', done => {
    request(GOODREADS_QUOTES_URL, (err, res, body) => {
      expect(res.statusCode).to.equal(200);
      done();
    })
  }).timeout(4000);  // set timeout to 4000ms due to occasional delayed response from goodreads

  it('should not return an empty object', done => {
    request(GOODREADS_QUOTES_URL, (err, res, body) => {
      expect(body).to.not.be.empty;
      done();
    })
  }).timeout(4000);  // set timeout to 4000ms due to occasional delayed response from goodreads
})

// todo: test quotes output file results
describe('Quotes output file created', function() {
  it('should output quotes to a text file', done => {
    // delete file if it exists
    fs.truncate('./goodreads_quotes_output.txt', 0, () => {
      expect(file('./goodreads_quotes_output.txt')).to.not.exist;
    });

    // execute fetchQuotes function, verify that file exists
    app.fetchQuotes(quotes => {
      expect(file('./goodreads_quotes_output.txt')).to.exist;
    })

    // delete file
    fs.truncate('./goodreads_quotes_output.txt', 0, () => {
      expect(file('./goodreads_quotes_output.txt')).to.not.exist;
    });

    done();
  })
})