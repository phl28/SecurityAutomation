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

    // console.log(mongoDBDatabases);
    // console.log(meteorGalaxyData);
    console.log(githubData);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main()