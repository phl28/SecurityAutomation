import { fetchMongoDBDatabases } from './mongoData';
import { fetchMeteorGalaxyServers } from './meteorData';
import { fetchGithubData } from './githubData';
import { fetchGithubSecurityData } from './githubSecurityData';
import Papa from 'papaparse';
import fs from 'fs';

async function main() {
  try {
    // Fetch data from other systems and store them in respective variables
    const githubSecurityData = await fetchGithubSecurityData();
    console.log(githubSecurityData);
    const mongoDBDatabases = await fetchMongoDBDatabases();
    const meteorGalaxyData = await fetchMeteorGalaxyServers();
    const githubData = await fetchGithubData();

    console.log('MongoDB Databases:', mongoDBDatabases);
    // // mongoDBDatabases?.forEach((database) => database.accessUsers.forEach((user) => console.log(user)))
    console.log('MeteorGalaxy:', meteorGalaxyData);
    // // meteorGalaxyData?.apps.forEach((app) => console.log(app.activities))
    console.log('Github:', githubData);
    // // githubData?.forEach((repo) => console.log(repo.activities))
    // const githubCSV = Papa.unparse(githubData);
    // fs.writeFileSync('githubData.csv', githubCSV);
    // const meteorCSV = Papa.unparse(meteorGalaxyData?.apps);
    // fs.writeFileSync('meteorData.csv', meteorCSV);
    // const mongoCSV = Papa.unparse(mongoDBDatabases);
    // fs.writeFileSync('mongoData.csv', mongoCSV);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();
