/* 
function that takes info from inquirer and axios call and makes markdown
*/
function generateMarkdown(github_data, inquirerData) {
  let mdArray = []; // will join to string at end
  let tableContents = []; // array that holds sections for table of contents

  // title section
  mdArray.push(`# ${inquirerData.title}`);
  let badges = [];

  //if shields section
  if (inquirerData.badgeConfirmation) {
    for (let i = 1; i <= 30; i++) {
      let badgeLabel = inquirerData[`badgeLabel${i}`];
      let badgeMessage = inquirerData[`badgeMessage${i}`];
      let badgeLink = inquirerData[`badgeLink${i}`]; 

      

      if (badgeLabel && badgeMessage && badgeLabel !== "" && badgeMessage !== "") {
        badges.push(`[![shield](https://img.shields.io/badge/${badgeLabel}-${badgeMessage}-blue)](${badgeLink})`);
      }
    }

    mdArray.splice(1,0, ...badges);
  }

  // description
  mdArray.push(`\n${inquirerData.description}`);
  
  // installation section
  if (inquirerData.installationSection){
    mdArray.push(`## Installation`);
    mdArray.push("<a href='installation'></a>");
    tableContents.push("* [Installation](#installation)");


    for (let i = 1; i<=20; i++) {
      let data = inquirerData[`installationStep${i}`];
      // if the first step wasn't filled out
      if (i == 1 && data == "") {
        mdArray.push(`${i}.`);
      } else if (data && data !== "") {
        mdArray.push(`${i}. ${data}`);
      }
    }
  }

  mdArray.push("## Usage");
  mdArray.push("<a href='usage'></a>");
  tableContents.push("* [Usage](#usage)");
  mdArray.push(`${inquirerData.usage}`);

  if (inquirerData.picturepath !== "") {
    mdArray.push(`${inquirerData.picturepath}`);
  }

  // contributor section
  // at most 10 allowed
  if (inquirerData.contributorSection) {
    mdArray.push(`## Contributors`);
    mdArray.push("<a href='contributors'></a>");
    tableContents.push("* [Contributors](#contributors)");
    for (let i = 1; i<=10; i++) {
      let name = inquirerData[`contributor${i}Name`];
      let github = inquirerData[`contributor${i}Github`];
      // if the first step wasn't filled out
      if (i == 1 && name == "") {
        mdArray.push("* ");
      } else if (name && name !== "" && github && github !== "") {
        mdArray.push(`* ${name} - [Github](https://www.github.com/${github})`);
      } else if (name && name !== "") {
        mdArray.push(`* ${name}`);
      }
    }
  }

  // license section
  mdArray.push("## License")
  mdArray.push("<a href='license'></a>");
  tableContents.push("* [License](#license)");
  mdArray.push(`This project is licensed under the ${inquirerData.license}`);

  // contributing section
  if (inquirerData.contributing !== "") {
    mdArray.push("## Contributing");
    mdArray.push("<a href='contributing'></a>");
    tableContents.push("* [Contributing](#contributing)");
    mdArray.push(`${inquirerData.contributing}`);
  }

  // Testing section
  if (inquirerData.testConfirmation) {
    mdArray.push("## Tests");
    mdArray.push("<a href='tests'></a>");
    tableContents.push("* [Tests](#tests)");
    mdArray.push(`${inquirerData.tests}`);
  }

  // questions section
  mdArray.push("## Questions");
  mdArray.push("<a href='questions'></a>");
  tableContents.push("* [Questions](#questions)");
  mdArray.push(`Email: ${github_data.email}\n`);
  mdArray.push(`<img width="90px" height="90px" style="margin-right:40px" align="left" alt="my photo" src="${github_data.avatar_url}"/>`);
  
  // table of contents
  if (inquirerData.tableOfContents){
    tableContents.unshift("## Table Of Contents"); // add title to the beginning of array
    
    mdArray.splice(badges.length+1 ,0, ...tableContents); // add contents to the mark down array
  }
  
  // join the array with two \n so that each section is on a new line
  const markdown = mdArray.join("\n");

  return new Promise((resolve, reject) => {
    resolve(markdown);
  })
}


module.exports = generateMarkdown;
