const cheerio = require('cheerio');
const fs = require('fs');
const readline = require('readline');
const request = require('request');
const url = 'https://www.goodreads.com/author/quotes/1244.Mark_Twain';

const MAX_QUOTES = 10;


// set up input/output functionality
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// todo: write request code to fetch, parse, and write quotes from goodreads to a text file


// todo: authenticate user with goodreads


// prompt user for goodreads credentials
const getLoginInfo = (done) => {
  let username, password, user;
  rl.question('Enter username: ', usernameInput => {
    rl.question('Enter password: ', passwordInput => {
      username = usernameInput;
      password = passwordInput;
      user = {username, password};
      return console.log(user);
    })
  })
};

getLoginInfo();

// todo: export app / functions for testing
