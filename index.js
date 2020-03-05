const inquirer = require("inquirer");
const axios = require("axios");
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
  
  // dynamically add questions with addtableofContentsQuestions()
  // supports up to 20 sections
  // when nothing is inputted then it will stop asking for sections
  
  
  {
    //index 23
    type: "confirm",
    message: "Installation Section : ",
    name: "installationSection"
  },

  // dynamically add questions with addInstallationQuestions
  // supports up to 20 steps
  // when nothing is inputted then it will stop asking for steps
  //index 2
  
  {
    //index 44
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
    // index 45
    type: "input",
    message: "Picture Path for usage:  ",
    name: "picturepath"
    // maybe check if file exists
  },
  {
    // index 46
    type: "confirm",
    message: "Other Contributors: ",
    name: "contributorSection"
  },
  

  {
    //index 57
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
  }

  
];

// function checkNumber(num) {
//   return function(answers) {
//     if (num <= answers.numberOfSections) {
//       return true;
//     } else {
//       return false;
//     }
//   }
// }

// function adds 20 questions to questions array
function addTableOfContentsQuestions(spliceStartNumber) {
  let questionArray = [];

  for (let i=1; i<=20; i++) {
    let obj = {};
    obj.type = "input";
    obj.name = `section${i}`;
    obj.message = `${i}:  `;

    // if first table of content check if confirm table of contents
    if (i==1) {
      obj.when = function(answers) {
        return answers.tableOfContents;
      }
    }
    // check that a valid response was given if blank then they won't work 
    else {
      obj.when = function(answers) {
        let lastIndex = i - 1;
        return answers[`section${lastIndex}`]
      }
    }
    
    questionArray.push(obj);
  }
  // add in the questions to the inquirer question array
  questions.splice(spliceStartNumber,0, ...questionArray);
  
} 


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

function writeToFile(fileName, data) {

}

function init() {
  let promptAnswers;
  let email;
  let image;
  inquirer.prompt(questions)
    .then(function(answers) {
      console.log(answers);
      promptAnswers = answers;
      return api.getData(answers.githubUser);
    })
    .then((res) => {
      image = res.data.avatar_url;
      email = res.data.email;
      //console.log(res.data);
      return generateMarkdown(res.data, promptAnswers);
    })
    .then(markdown => {
      fs.writeFile("readmetest.md", markdown, (err) => {
        if(err) throw err;
      })
    }) 
      
}

addTableOfContentsQuestions(3); // add table of contents questions nothing asynchronous
addInstallationQuestions(24);  // add instructino steps
addContributorsQuestions(47);
init();




