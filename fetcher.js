const request = require('request');
const fs = require('fs');
const readline = require('readline');

const url = process.argv[2];
const path = process.argv[3];

// Helper function which prints content to a file
const writeContentIntoFile = (fileName, content) => {

  // write to a file
  fs.writeFile(fileName, content, (err) => {
    // display an error if file path is invalid and exit
    if (err) {
      console.log("Invalid file path");
      process.exit(0);
    }
   
    // fetch the file size right after it was created
    fs.stat(fileName, (err, stats) => {
      const size = stats["size"];
      console.log(`Downloaded and saved ${size} bytes to ${fileName}.`);
    });
  });
};

// make http request
request(url, (error, response, body) => {

  // if couldn't fetch data for some reason or status code is not 200,
  // print error message to the console and exit
  if (error || response.statusCode !== 200) {
    console.log("Cannot fetch data from passed url");
    process.exit(0);
  }

  // check if the file at current path already exists
  fs.access(path, fs.constants.F_OK, (err) => {
    // if it exists
    if (!err) {
      // create readline instance to fetch user input
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      // ask user if they want to overwrite the existing file
      rl.question("File already exists. Type Y to overwrite\n", (answer) => {
        // if their answer is anything but 'Y' or 'y', exit
        if (answer !== 'Y' && answer !== 'y') {
          process.exit(0);
        }
        // don't forget to close readline instance
        rl.close();
        // proceed to overwriting a file if 'Y' is given as an input
        writeContentIntoFile(path, body);
      });
    // if file doesn't exist, write file
    } else {
      writeContentIntoFile(path, body);
    }
  });
});