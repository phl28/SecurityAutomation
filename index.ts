import { createObjectCsvWriter } from 'csv-writer';
import { config } from './config';
import { fetchMongoDBDatabases } from './mongoData';
import { fetchMeteorGalaxyServers } from './meteorData';
import { fetchGithubData } from './githubData';

async function main() {
  try {

    // Fetch data from other systems and store them in respective variables
    const mongoDBDatabases = await fetchMongoDBDatabases();
    const meteorGalaxyData = await fetchMeteorGalaxyServers();
    const githubData = await fetchGithubData();

    console.log('MongoDB Databases:', mongoDBDatabases);
    // mongoDBDatabases?.forEach((database) => database.accessUsers.forEach((user) => console.log(user)))
    console.log('MeteorGalaxy:', meteorGalaxyData);
    // meteorGalaxyData?.apps.forEach((app) => console.log(app.activities))
    console.log('Github:', githubData);
    // githubData?.forEach((repo) => console.log(repo.activities))
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main()