const chai = require('chai')
const chaiFiles = require('chai-files');
const expect = require('chai').expect;
const file = chaiFiles.file;
const fs = require('fs');
const request = require('request');
const app = require('../goodreads_quotes');

chai.use(chaiFiles);

const GOODREADS_QUOTES_URL = 'https://www.goodreads.com/author/quotes/1244.Mark_Twain';
const QUOTES_OUTPUT_FILE_PATH = 'goodreads_quotes_output.txt';
const EXPECTED_NUM_OF_QUOTES = 10;
const EXPECTED_KEYS = ['quoteText', 'quoteTags', 'quoteLikes'];

// test goodreads response at the Mark Twain quotes page url
describe('Goodreads quotes response', () => {
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

// test quotes output file results
describe('Quotes output file created', () => {
  it('should remove the text file if it already exists', done => {
    // delete file if it already exists
    const exists = fs.existsSync(QUOTES_OUTPUT_FILE_PATH);
    if (exists) {
      fs.unlinkSync(QUOTES_OUTPUT_FILE_PATH, (err,results) => {
        if (err) { 
          console.log('No existing file to delete.');
        } else {
          expect(file(QUOTES_OUTPUT_FILE_PATH)).to.not.exist;
        };
      });
    };
    done();
  })

  it('should create a new text file', done => {
    // execute fetchQuotes function, verify that file exists
    app.fetchQuotes(quotes => {
      expect(file(QUOTES_OUTPUT_FILE_PATH)).to.exist;
      done();
    })
  })
})

describe('Quotes output file validation', () => {
  it('should output an array', done => {
    const textFileOutput = JSON.parse(fs.readFileSync(QUOTES_OUTPUT_FILE_PATH, 'utf8'));
    expect(textFileOutput).to.be.an('array');
    done();
  })

  it('should output an array of expected length', done => {
    const textFileOutput = JSON.parse(fs.readFileSync(QUOTES_OUTPUT_FILE_PATH, 'utf8'));
    expect(textFileOutput).to.have.lengthOf(EXPECTED_NUM_OF_QUOTES);
    done();
  })

  it('should contain expected data points', done => {
    const textFileOutput = JSON.parse(fs.readFileSync(QUOTES_OUTPUT_FILE_PATH, 'utf8'));
    textFileOutput.forEach(item => {
      expect(item).to.have.all.keys(EXPECTED_KEYS);
    })
    done();
  })
})