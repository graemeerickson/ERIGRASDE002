const cheerio = require('cheerio');
const fetch = require('node-fetch');
const fs = require('fs');
const readline = require('readline');

const MAX_QUOTES = 10;
const url = 'https://www.goodreads.com/author/quotes/1244.Mark_Twain';

// set up command line interface input/output functionality
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// write request code to fetch, parse, and write quotes from goodreads to a text file
const fetchQuotes = (done) => {
  fetch(url)
    .then(res => res.text())
    .then(body => {
      const $ = cheerio.load(body);
      const quotes = $('.quote').map( (index, quote) => {
        if (index < MAX_QUOTES) {
          return {
            quoteText: $(quote).find('.quoteText').text().match(/“(.*?)”/g)[0],
            quoteTags: $(quote).find('.greyText').text().trim().match(/\s\w+/g),
            quoteLikes: $(quote).find('.right').text().trim()
          }
        }
      }).get()
      
      // write results to text file
      fs.writeFile('./goodreads_quotes_output.txt', JSON.stringify(quotes, null, 2), function(err) {
        if(err) { return console.log(err); }
      });

      // resolve promise
      return done(quotes);
    })
    .catch(err => {
      console.log('error fetching from goodreads:', err);
    })
}

// authenticate user with goodreads
const checkForAuthorizedUser = (user, done) => {
  // hard-coded to true in absence of auth functionality
  done(true);
}

// prompt user for goodreads credentials
const getLoginInfo = () => {
  let username, password, user;
  rl.question('Enter username: ', usernameInput => {
    rl.question('Enter password: ', passwordInput => {
      username = usernameInput;
      password = passwordInput;
      user = {username, password};

      // authenticate the user with Goodreads. if authenticated, display
      // quotes, else re-prompt for username & password.
      checkForAuthorizedUser(user, (authenticated) => {
        if(authenticated){
          rl.close();
            fetchQuotes(quotes => {
              console.log("Quotes available to review in output file: goodreads_quotes_output.txt");
            });
        } else {
          getLoginInfo();
        }
      })
    })
  })
};

getLoginInfo();

// export fetchQuotes function for test script to access
module.exports = {
  fetchQuotes: fetchQuotes
}