# ERIGRASDE002
## Problem
Applying "Test Driven Development" concepts, create 3 unit testing artifacts to verify the code you will build using the following requirements.

Write a script that:
  1. receives username and password when executed from the command line,
  2. authenticates to http://www.goodreads.com website,
  3. then it finds, retrieves, and stores in a file the top 10 most popular quotes from Mark Twain.

Note: Explain how to run your code and how to run your tests.
## Approach
### Tools & Technologies
#### Language
I chose to write the solution in Javascript for three reasons:
  1. I knew I wanted to solve problem #3 with a Node.js backend, so writing this problem's solution in Javascript would code reusability.
  2. I have prior experience using Mocha and Chai for Javascript-based testing, so I chose to leverage that familiarity.
  3. I'm familiar with using callback functionality in Javascript, which I knew I'd need in order to force the script to wait to receive the parsed quotes before trying to display them on screen.

#### Tools
* Webscraping:
  * node-fetch: Enabled requesting & retrieving the raw HTML from the [Goodreads Mark Twain quotes webpage](https://www.goodreads.com/author/quotes/1244.Mark_Twain "Goodreads Mark Twain quotes webpage") using the *fetch* statement.
  * Cheerio: Enabled parsing the retrieved HTML with methods built into Cheerio like 'find'. Using this package freed me from manually traversing the DOM and instead focus on simply finding the right "hooks" (via elements and/or class names) to target the relevant information.
* Command line interaction:
  * readline: Enabled accepting input and displaying output via the command line interface.
* Filesystem interaction:
  * fs: Enabled writing to a text file in both the main program and the test script, and enabled checking for and deleting an existing text file in the text script.
* Testing:
  * Mocha: Testing framework that executed the tests.
  * Chai: Assertion library that enabled straightforward and readable test cases.
  * chai-files: Chai package that enabled simpler testing related to the filesystem (e.g., checking whether a file exists).
  * request: Enabled http requests to simulate fetching quotes data from Goodreads.

### Logic Flow
I organized the logic flow of the script as follows:
1. Prompt the user for his/her username and password, storing the inputs into a user object.
2. Pass the user object to a helper function that authenticates the credentials with Goodreads' OAuth API. **NOTE: This step not complete. User is considered as authenticated in absence of authentication code.**
3. If the user is not authenticated, re-prompt the user for his/her username & password.
4. If the user is authenticated, execute another helper function that fetches the raw HTML from the Goodreads Mark Twain quotes page.
5. Parse the HTML using Cheerio to enable querying specific data in the DOM with Cheerio's built-in methods like 'find'.
6. Find & store into a new *quotes* array the top 10 quotes by querying elements with class name *quote*. Set limit to 10 by referencing a constant variable defined at the top of the script so as to allow easy maintainability going forward in case the desired number of posts changes.
7. Loop through the retrieved quotes and, with each quote, find the following information and store into an object structure, then push the resulting object into the *quotes* array.
    * Quote text, by querying elements with class name *quoteText* and manipulating the resulting string using regex
    * Quote tags, by querying elements with class name *greyText* and manipulating the resulting string using regex and the trim method
    * Quote 'like' count, by querying elements with class name *right*
8. Create a text file (or overwrite if one already exists) called *goodreads_quotes_output.txt*, and write the *quotes* data structure into it using the *JSON.stringify* method.
9. Once the test file has been created, notify the end user via the command line that the quotes are ready to be reviewed.

### Data Structures
There are two primary data structures in this script:
1. User object
  > Structured as an object due to its natural key/value pairs - username and password.
2. Quotes array of objects
  > Storing the relevant quotes data into an array of objects made the most sense for a couple reasons:
  > Why an array? Given challenge problem #3, I knew I would need to ultimately loop through this data structure on the frontend. Storing as an array would simplify that loop functionality.
  > Why objects? Each quote contains a natural key/value pair: a description and a value (e.g., "quoteText": "If you tell the truth, you don't have to remember anything."). An array of arrays would have also been possible, but would have been less clear about what information each element represented since the values would need to be stored without related descriptions.

## How to Test
### Manual Testing
To test this script, make sure you have node and npm installed on your machine and run the command *npm install* within the app directory to install all required packages (e.g., Cheerio). Then run the following command from the terminal / command line: *node goodreads_quotes.js*

Once the command is processed, verify that a file named *goodreads_quotes_output.txt* exists in the same directory as the script, and that it contains 1 array consisting of 10 objects, and that each object contains the following key/value pairs:

    {
      "quoteText": string containing the quote text from the Goodreads Mark Twain quotes page
      "quoteTags": array of strings pertaining to the tags related to the respective quote
      "quoteLikes": string containing the number of likes associated with the quote
    }
Verify that the 10 quotes in the file are the top 10 from the Goodreads Mark Twain quotes page by navigating to the Goodreads page and comparing the order & content of quotes in the file with the order & content of quotes on the webpage.

Once all of the above is verified, execute the script again to verify that a duplicate file isn't created, and the script overwrites rather than appends to the file.
### Automated Testing
As noted above, make sure you have node and npm installed on your machine and run the command *npm install* within the app directory to install all required packages (e.g., Cheerio). Then run the following command from the terminal / command line: *npm test*

That command will kick off the following automated tests:
  * The Goodreads Mark Twain quotes page:
    * Returns a '200' ('success') response
    * Does not return an empty data object
  * The quotes output text file is created:
    * Any existing text file of the same name is deleted
    * The quote fetching function from the main app is executed, and a new text file is created
  * The quotes output text file is valid:
    * The data structure in the file is an array
    * The data structure is of length '10'
    * The data structure contains the expected data points: quoteText, quoteTags, and quoteLikes.

The Mocha framework will summarize the results of each test, which should all pass.