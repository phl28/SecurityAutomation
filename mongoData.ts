import { config } from './config';
import AxiosDigestAuth from '@mhoc/axios-digest-auth';

interface Database {
  name: string;
  size: number;
  storageUsage: number;
  storageLimit: number;
  accessUsers: User[];
  backupEnabled: boolean;
  ipAccess: string[];
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
  backupEnabled: boolean;
  emailAddress: string;
  roles: Role[];
  firstName: string;
  lastName: string;
  ipAddress: string;
}

interface Role {
  roleName: string;
}

interface User {
  name: string;
  emailAddress: string;
  role: Role[];
}

interface Response {
  results: Group[];
}
export async function fetchMongoDBDatabases() {
  const { publicKey, privateKey } = config.mongoAtlas;
  const base_url = 'https://cloud.mongodb.com/api/atlas/v1.0/';
  const databases: Database[] = [];

  try {
    const digestAuth = new AxiosDigestAuth({
      username: publicKey,
      password: privateKey,
    });

    const response = await digestAuth.request({
      headers: { Accept: 'application/json' },
      method: 'GET',
      url: base_url + 'groups',
    });
    const projects = response.data as Response;
    for (const project of projects.results) {
      const projectResponse = await digestAuth.request({
        headers: { Accept: 'application/json' },
        method: 'GET',
        url: base_url + 'groups/' + project.id + '/clusters',
      });

      const userResponse = await digestAuth.request({
        headers: { Accept: 'application/json' },
        method: 'GET',
        url: base_url + 'groups/' + project.id + '/users',
      });

      const accessResponse = await digestAuth.request({
        headers: { Accept: 'application/json' },
        method: 'GET',
        url: base_url + 'groups/' + project.id + '/accessList',
      });

      const accesses = accessResponse.data as Response;
      const users = userResponse.data as Response;
      const clusters = projectResponse.data as Response;
      const accessUsers: User[] = [];
      const ipAccess: string[] = [];

      for (const access of accesses.results) {
        ipAccess.push(access.ipAddress);
      }

      for (const user of users.results) {
        const roles = user.roles as Role[];
        const userDetails = {
          name: user.firstName + ' ' + user.lastName,
          emailAddress: user.emailAddress,
          role: roles,
        };
        accessUsers.push(userDetails);
      }

      for (const cluster of clusters.results) {
        const databaseDetails = {
          name: project.name,
          clusterName: cluster.name,
          size: cluster.diskSizeGB,
          storageUsage: cluster.replicationFactor * 0.128 * cluster.numShards,
          storageLimit: cluster.replicationFactor * cluster.diskSizeGB,
          accessUsers,
          backupEnabled: cluster.backupEnabled,
          ipAccess,
        };
        databases.push(databaseDetails);
      }
    }
    return databases;
  } catch (error) {
    console.error('Error fetching MongoDB databases:', error);
    throw error;
  }
}
