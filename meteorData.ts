import axios from 'axios';
import { config } from './config';

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
                url
                cluster
                versions {
                version
                userName
                createdAt
                buildStatus
                deployStatus
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
        return userData;
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}
