# Security Monitoring Engine

## Installation instructions
- Install npm

- run `npm install -g typescript` and `npm install -g ts-node-dev`

- run `npm install` to restore npm dependencies

## Setting up config file
- run `touch config.ts` in root directory to create a config file that will store the secret keys
```typescript
import { readFileSync } from 'fs';

export const config = {
  // if you have MongoDB data to keep track of
  mongoAtlas: {
    publicKey: 'YOUR_PUBLIC_KEY',
    privateKey: 'YOUR_PRIVATE_KEY',
  },
  // if you have Meteor Galaxy data to keep track of 
  meteorGalaxy: {
    apiKey: 'YOUR_API_KEY',
    username: 'YOUR_ORGANISATION_USERNAME',
  },
  // if you have github data to keep track of 
  github: {
    organization: 'YOUR_ORGANISATION',
    // if this system is used on behalf of an organisation, then it is recommended to create a Github app and follow with the following 
    appId: 'YOUR_APPID',
    privateKey: readFileSync('PATH_TO_PRIVATE_KEY, 'utf8'),
    installationId: 'YOUR_INSTALLATION_ID',
    // if this system is for personal use, then follow this bit
    token: 'YOUR_PERSONAL_ACCESS_TOKEN',
  },
  // more configs could be added depending on usecase
};
```

## Generating API/ secret keys
### Mongo Atlas
https://www.mongodb.com/docs/atlas/configure-api-access/

### Meteor Galaxy
[https://{{region}}.galaxy.meteor.com/{{org}}/settings ](url)  
Substitude region with `us-east-1` or `eu-west-1` or `ap-southeast-2` depending on the region the apps are deployed in

### Github
- If this is for personal use, you will need to generate a peronal access token for the Github API  
  https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
  (note that Octokit works slighly differently if a personal access token is used, visit Github documentation for more details)

- If this is for an organisation, you will need to create a Github app
  1. Create Github app and get the App Id
  https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/registering-a-github-app

  2. Generate a private key
  https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/managing-private-keys-for-github-apps

  3. Move the downloaded pem file to your repo directory and read it in the config file
