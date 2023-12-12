const fs = require('fs');
const readline = require('readline');
const process = require('process');
const { exec } = require('child_process');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));

const npmrc_path = ".npmrc";

async function write_npmrc_file(npmrc_path, token) {
  const npmrc_content = `@ngrave:registry=https://gitlab.com/api/v4/projects/24776091/packages/npm/
  //gitlab.com/api/v4/projects/24776091/packages/npm/:_authToken=${token}`
  await fs.writeFile(npmrc_path, npmrc_content, err => {
    if (err) {
      console.error('Error creating .npmrc file:', err);
    }
  });
}

async function is_npmrc_valid() {
  return new Promise((resolve, reject) => {
    exec('npm info @ngrave/avax', (error, stdout, stderr) => {
      if (error) {
        reject(error)
      } else {
        resolve(true)
      }
    })
  })
}

(async() => {
  while(true) {
    let is_npm_valid = false
    try {
      is_npm_valid = await is_npmrc_valid();
    } catch(err) {
      is_npm_valid = false;
    }
    if (!is_npm_valid) {
      console.error(`\nYour npmrc file is wrong or token is expired. Check again\n`);
    } else {
      process.exit(0)
    }
    const token = await prompt("Login to your company gitlab, visit this link https://gitlab.com/-/profile/personal_access_tokens and create a new token with 'read_api' permission. Enter the token here: ")
    await write_npmrc_file(npmrc_path, token)
  }
})();