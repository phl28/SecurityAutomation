import axios from 'axios';
import { config } from './config';

interface Version {
    version: string;
    status: string | null;
}

interface Activity {
    type: string;
    username: string;
    timestamp: string;
    version: Version | null;
}

interface App {
    hostname: string;
    status: string;
    createdAt: string;
    containerCount: number;
    cluster: string;
    activities: Activity[];
}

interface User {
    accountLocked: boolean;
    apps: App[];
    appCount: number;
    runningAppCount: number;
}

export async function fetchMeteorGalaxyServers() {
    const { apiKey, username } = config.meteorGalaxy;
    const apiUrl = 'https://eu-west-1.api.meteor.com/graphql';

    const query = `
        query($username: String!) {
            user(username: $username) {
                accountLocked
                apps {
                  _id
                  hostname
                  status
                  createdAt
                  containerCount
                  cluster
                        versions {
                    _id
                    version
                    buildStatus
                    deployStatus
                  }
                  activities {
                    type
                    versionId
                    userName
                    createdAt
                }
                }
                appCount
                runningAppCount
            }
        }
    `;

    try {
        const response = await axios.post(apiUrl, {
        query,
        variables: {
            username,
        },
        }, {
        headers: {
            'Content-Type': 'application/json',
            'galaxy-api-key': apiKey,
        },
        });

        const userData = response.data.data.user;
        const apps: App[] = [];
        for (const app of userData.apps) {
            const activities: Activity[] = [];
            const versions: Version[] = [];
            for (const activity of app.activities) {
                let versionDetails: Version | null = null;
                if (activity.versionId) {
                    const version = app.versions.find((version: { _id: any; }) => version._id === activity.versionId);
                    let status = null;
                    if (activity.userName === '') {
                        if (activity.type.includes('Build')) {
                            status = version.buildStatus;
                        }
                        else if (activity.type.includes('Deploy')) {
                            status = version.deployStatus;
                        }
                    }
                    versionDetails = {
                        version: version.version,
                        status,
                    }
                }
                const activityDetails: Activity = {
                    type: activity.type,
                    username: activity.userName,
                    version: versionDetails,
                    timestamp: activity.createdAt,
                }
                activities.push(activityDetails);
            }
            const appDetails = {
                hostname: app.hostname,
                status: app.status,
                createdAt: app.createdAt,
                containerCount: app.containerCount,
                cluster: app.cluster,
                activities
            }
            apps.push(appDetails);
        }

        const userDetails: User = {
            accountLocked: userData.accountLocked,
            apps,
            appCount: userData.appCount,
            runningAppCount: userData.runningAppCount,
        }
        return userDetails;
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}
