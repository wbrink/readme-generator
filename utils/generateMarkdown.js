/* 
function that takes info from inquirer and axios call and makes markdown
*/
function generateMarkdown(github_data, inquirerData) {
  let mdArray = []; // will join to string at end

  // title section
  mdArray.push(`# ${inquirerData.title}`);
  mdArray.push(`${inquirerData.description}`);
  
  // table of contents
  if (inquirerData.tableOfContents){
    mdArray.push(`## Table Of Contents`);

    for (let i = 1; i<=20; i++) {
      let section = inquirerData[`section${i}`];
      if (section && section !== "") {
        mdArray.push(`* ${section}`);
      }
    }
  }

  // installation section
  if (inquirerData.installationSection){
    mdArray.push(`## Installation`);

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
  mdArray.push(`${inquirerData.usage}`);

  if (inquirerData.picturepath !== "") {
    mdArray.push(`${inquirerData.picturepath}`);
  }

  // contributor section
  // at most 10 allowed
  if (inquirerData.contributorSection) {
    mdArray.push(`## Contributors`);
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
  mdArray.push(`This project is licensed under the ${inquirerData.license}`);

  // contributing section
  if (inquirerData.contributing !== "") {
    mdArray.push("## Contributing");
    mdArray.push(`${inquirerData.contributing}`);
  }

  // Testing section
  if (inquirerData.testConfirmation) {
    mdArray.push("## Tests");
    mdArray.push(`${inquirerData.tests}`);
  }

  // questions section
  mdArray.push("## Questions");
  mdArray.push(`Email: ${github_data.email}`);
  mdArray.push(`<img width="90px" height="90px" style="margin-right:40px" align="left" alt="my photo" src="${github_data.avatar_url}"/>`);
  

  

  // join the array with two \n so that each section is on a new line
  const markdown = mdArray.join("\n\n");

  return new Promise((resolve, reject) => {
    resolve(markdown);
  })
}


module.exports = generateMarkdown;
