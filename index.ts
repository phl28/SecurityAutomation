import { createObjectCsvWriter } from 'csv-writer';
import { config } from './config';
import { fetchMongoDBDatabases } from './mongoData';
import { fetchMeteorGalaxyServers } from './meteorData';

async function main() {
  try {

    // Fetch data from other systems and store them in respective variables
    const mongoDBDatabases = await fetchMongoDBDatabases();
    const meteorGalaxyData = await fetchMeteorGalaxyServers();

    console.log(mongoDBDatabases);
    console.log(meteorGalaxyData);
    // Process the collected data as per your requirements

    // // Generate CSV
    // const csvWriter = createObjectCsvWriter({
    //   path: config.csvFilePath,
    //   header: [
    //     // Define headers for the CSV columns
    //     // For example: { id: 'columnName', title: 'Column Title' }
    //   ],
    // });

    // const records = [
    //   // Create an array of objects representing the data for each row
    //   // For example: { columnName: 'data', ... }
    // ];

    // await csvWriter.writeRecords(records);
    console.log('CSV file generated successfully!');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main()