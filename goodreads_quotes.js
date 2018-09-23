const cheerio = require('cheerio');
const fetch = require('node-fetch');
const fs = require('fs');
const readline = require('readline');
const url = 'https://www.goodreads.com/author/quotes/1244.Mark_Twain';

const MAX_QUOTES = 10;


// set up input/output functionality
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// todo: write request code to fetch, parse, and write quotes from goodreads to a text file
const fetchQuotes = (done) => {
  console.log('hit fetchQuotes');
  fetch(url)
    .then(res => res.text())
    .then(body => {
      const $ = cheerio.load(body);
      const quotes = $('.quote').map( (index, quote) => {
        if (index < MAX_QUOTES) {
          return {
            quoteText: $(quote).find('.quoteText').text().match(/“(.*?)”/g)[0],
            quoteTags: $(quote).find('.greyText').text().match(/\s\w+/g),
            quoteLikes: $(quote).find('.right').text().trim()
          }
        }
      }).get()
      
    // todo: write results to a file
    fs.writeFile('./goodreads_quotes_output.txt', JSON.stringify(quotes, null, 2), function(err) {
      if(err) { return console.log(err); }
    });

    return done(quotes);
    })
    .catch(err => {
      console.log('error fetching from goodreads:', err);
    })
}


// todo: authenticate user with goodreads
const checkForAuthorizedUser = (user, done) => {
  console.log('user data received:', user);
  
  // hard-coded to true temporarily until auth code is written
  done(true);
}

// prompt user for goodreads credentials
const getLoginInfo = (done) => {
  let username, password, user;
  rl.question('Enter username: ', usernameInput => {
    rl.question('Enter password: ', passwordInput => {
      username = usernameInput;
      password = passwordInput;
      user = {username, password};
      console.log('user:', user);

      checkForAuthorizedUser(user, (authenticated) => {
        if(authenticated){
          rl.close();
          fetchQuotes(quotes => {
            console.log('returnedQuotes:', quotes);
          });
        } else {
          getLoginInfo();
        }
      })
    })
  })
};

getLoginInfo();

// todo: export app / functions for testing
module.exports = {
  fetchQuotes: fetchQuotes
}