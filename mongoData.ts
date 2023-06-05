import axios from 'axios';
import { config } from './config';
import AxiosDigestAuth from '@mhoc/axios-digest-auth';

interface Database {
    name: string;
    size: number;
    storageUsage: number;
    storageLimit: number;
    // accessUsers: string[];
}
interface Group {
    clusterCount: number;
    created: string;
    id: string;
    name: string;
    orgId: string;
    diskSizeGB: number;
    replicationFactor: number;
    numShards: number;
}

interface Response {
    results: Group[];
}
export async function fetchMongoDBDatabases(){
    const { publicKey, privateKey } = config.mongoAtlas;
    const base_url = "https://cloud.mongodb.com/api/atlas/v1.0/";
    const databases = [];

    try {
        const digestAuth = new AxiosDigestAuth({
            username: publicKey,
            password: privateKey,
        });
        
        const response = await digestAuth.request({
            headers: { Accept: "application/json" },
            method: "GET",
            url: base_url + 'groups',
        });
        const projects = response.data as Response;
        for (const project of projects.results) {
            const projectResponse = await digestAuth.request({
                headers: { Accept: "application/json" },
                method: "GET",
                url: base_url + 'groups/' + project.id + '/clusters',
            })
            // console.log(projectResponse.data)
            const clusters = projectResponse.data as Response;
            // console.log(clusters.results)

            for (const cluster of clusters.results) {
                const databaseDetails = {
                    name: project.name,
                    clusterName: cluster.name,
                    size: cluster.diskSizeGB,
                    storageUsage: cluster.replicationFactor * 0.128 * cluster.numShards,
                    storageLimit: cluster.replicationFactor * cluster.diskSizeGB,
                    // accessUsers: databaseResponse.data.access,
                }
                databases.push(databaseDetails);
            }    
        }
    return databases;
    }catch (error) {
        console.error('Error fetching MongoDB databases:', error);
        throw error;
    }
}