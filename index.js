const inquirer = require("inquirer");
const fs = require("fs");

const api = require("./utils/api");
const generateMarkdown = require("./utils/generateMarkdown");

// questions objects for inquirer 
const questions = [
  {
    type: "input",
    message: "Title:  ",
    name: "title",
    default: "Title of Project"
  },
  {
    type: "input",
    message: "Description:  ",
    name: "description",
    default: "Place Description Here"
  },
  {
    type: "confirm",
    message: "Table of Contents:  ",
    name: "tableOfContents"
  },
  {
    //index 3
    type: "confirm",
    message: "Installation Section : ",
    name: "installationSection"
  },

  // dynamically add questions with addInstallationQuestions
  // supports up to 20 steps
  // when nothing is inputted then it will stop asking for steps
  //index 2
  
  {
    //index 24
    type: "input",
    message: "Usage:  ",
    name: "usage",
    validate: function(value) {
      if (value.length < 200){
        return true;
      } else {
        return "Usage Section is too long.";
      }
    },
    default: "Place usage instructions here" 
  },
  {
    // index 25
    type: "input",
    message: "Picture Path for usage:  ",
    name: "picturepath"
    // maybe check if file exists
  },
  {
    // index 26
    type: "confirm",
    message: "Other Contributors: ",
    name: "contributorSection"
  },
  

  {
    //index 37
    type: "list",
    name: "license",
    choices: ["MIT License", "GNU AGPLv3", "GNU GPLv3", "Mozilla Public License 2.0", "Apache License 2.0", "Boost Software License 1.0", "The Unlicense" ]
    // filter: function(val) {
    //   return val.toLowerCase();
    // }
  },
  {
    type: "input",
    name: "contributing",
    message: "Contributing Message: "
  },
  {
    type: "confirm",
    name: "testConfirmation",
    message: "Any Tests?  "
  },
  {
    type: "input",
    name: "tests",
    message: "Tests:  ",
    when: function(answers) {
      return answers.testConfirmation;
    }
  },
  {
    type: "input",
    name: "githubUser",
    Message: "What is your Github Username?  "
  },
  {
    type: "confirm", 
    message: "Would You like to add Badges?",
    name: "badgeConfirmation"
  }
];


// option to have up to 20 steps for installation if desired
function addInstallationQuestions(spliceStartNumber) {
  let questionArray = [];

  for (let i=1; i<=20; i++) {
    let obj = {};
    obj.type = "input";
    obj.message = `Step ${i}:  `;
    obj.name = `installationStep${i}`;
    
    // if on first question then check if installation section is wanted
    if (i === 1) {
      obj.when = function(answers) {
        return answers.installationSection;
      }
    } else {
      obj.when = function(answers){
        let lastIndex = i-1;
        // if lastindex is given a response then do this quesiton if not skip the rest
        return answers[`installationStep${lastIndex}`];
      };
    }

    questionArray.push(obj);
  }

  // add in the questions to the inquirer question array
  questions.splice(spliceStartNumber,0, ...questionArray);
  
}

// function that adds option to have up to 10 contributors if contributor section is wanted
function addContributorsQuestions(spliceStartNumber) {
  let questionArray = [];
  for (let i=1; i<=10; i++) {
    
    // create name question
    let obj = {};
    obj.type = "input";
    obj.message = `Contributor ${i} Name:  `;
    obj.name = `contributor${i}Name`;
    
    // if on first question then check if installation section is wanted
    if (i === 1) {
      obj.when = function(answers) {
        return answers.contributorSection;
      }
    } else {
      obj.when = function(answers){
        let lastIndex = i-1;
        // if lastindex is given a response then do this quesiton if not skip the rest
        return answers[`contributor${lastIndex}Github`]; // a value is truthy null or undefined is falsy
      };
    }

    // create link question
    let obj2 = {};
    obj2.type = "input";
    obj2.message = `Link to Contributor ${i}'s Github:  `;
    obj2.name = `contributor${i}Github`;
    obj2.when = function(answers) {
      return answers[`contributor${i}Name`]
    }

    questionArray.push(obj);
    questionArray.push(obj2);
  }

  // add in the questions to the inquirer question array
  questions.splice(spliceStartNumber,0, ...questionArray);
  
}

function addBadgesQuestions(spliceStartNumber) {
  for (let i = 1; i<=30; i++) {

    // ask for badge label
    obj = {};
    obj.type = "input";
    obj.message = "Label: ";
    obj.name = `badgeLabel${i}`;

    if (i==1) {
      obj.when = (answers) => answers.badgeConfirmation;
    } else {
      // if the badge message is skipped on previous then don't run
      obj.when = (answers) => answers[`badgeMessage${i - 1}`];
    }

    // ask for badge message
    obj2 = {};
    obj2.type = "input";
    obj2.message = "Message: ";
    obj2.name = `badgeMessage${i}`;
    obj2.when = (answers) => answers[`badgeLabel${i}`];


    // ask for badge message
    obj3 = {};
    obj3.type = "input";
    obj3.message = "Link (Optional): ";
    obj3.name = `badgeLink${i}`;
    obj3.when = (answers) => answers[`badgeMessage${i}`];

    questions.push(obj);
    questions.push(obj2);
    questions.push(obj3);

  }
}

function writeFile(data) {
  return new Promise((resolve, reject) => {
    fs.writeFile("README-Generated.md", data, (err) => {
      if (err) reject(err);
      console.log("readme file generated");
      resolve("success");
    })
  })
}

// main 
function init() {
  let promptAnswers;

  inquirer.prompt(questions)
    .then(function(answers) {
      //console.log(answers);
      promptAnswers = answers;
      return api.getData(answers.githubUser);
    })
    .then((res) => {
      return generateMarkdown(res.data, promptAnswers);
    })
    .then(markdown => {
      return writeFile(markdown);
    })
    .catch(err => {
      // if error occurred prompt to retry if no then end program
      inquirer.prompt([
        {
          type: "confirm",
          message: "An Error occurred fetching github user Try Again?: ",
          name: "tryAgain"
        }
      ]).then((answers) => {
        if (answers.tryAgain) {
          init();
        } 
      })
    })
    .finally(() => {
      console.log("Goodbye.")
    });


}


addInstallationQuestions(4);  // add instruction steps
addContributorsQuestions(27); // add contributor steps
addBadgesQuestions(questions.length);
init();




