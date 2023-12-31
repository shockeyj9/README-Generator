const { makeBadge, ValidationError } = require('badge-maker');


//Function for making the badge 
function renderLicenseBadge(licenseName) {
  if (licenseName==='Unlicense'){
    return '';
  }
  const format = {
    label: 'Liscense',
    message: licenseName,
    color: 'informational',
  }
  const svg = makeBadge(format);
  return svg;
}

//API Functions for getting License details
async function getLicenseDetails (license){
  const response = await fetch('https://api.github.com/licenses/'+license);
  const data = await response.json();
  return arr= {URL: data.html_url, DESC: data.description};
  }
  
  async function getDetails(license){
      const value = await getLicenseDetails(license)
      return value;
  }


//API functions for getting the license
async function getLicenseKey(license){
  const response = await fetch('https://api.github.com/licenses');
  const data = await response.json();
  return data;
}

async function getKey(license){
  const data = await getLicenseKey(license);
  const licInfo = data.filter((element)=>{
      if (element.spdx_id===license){
          return true
      }
  });
  return licInfo[0].key;
}

// Function that returns the license data for the README
async  function renderLicenseSection(license) {
  if (license==='Unlicense'){
    return '';
  }
  const rBadge = renderLicenseBadge (license);
  const rKey =  await getKey(license);
  const rLicArr = await getDetails(rKey);
  const licObject = 
      {
        badge: rBadge,
        licURl: rLicArr.URL,
        licDESC: rLicArr.DESC,
      }
      return licObject;
}


// Function to generate markdown for README
async function generateMarkdown(data) {
  const licObject = await renderLicenseSection(data.licenses);
  
  return `# ${data.title} <div align="right"> ${licObject.badge} </div>\n
## Description\n
${data.desc}\n
## Table of Contents\n
  1. [ Description ](#description)
  2. [ Installation ](#installation)
  3. [ Usage ](#usage)
  3. [ License ](#license)
  3. [ Tests ](#tests)
  3. [ How to Contribute ](#how-to-contribute)
  3. [ Questions ](#questions)
## Installation\n
${data.installs}\n

## Usage\n
${data.usage}\n

## License\n
${licObject.licURl} \n
${licObject.licDESC} \n

## Tests\n
${data.test}\n

## How to Contribute\n
${data.contribute}\n

## Questions\n
Please visit my GitHub profile [${data.username}](https://github.com/${data.username})\n
Feel free to reach out with any questions: ${data.email}\n
`;
  }
  

module.exports = {
  generateMarkdown
};
