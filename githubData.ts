import { Octokit } from "octokit";
import { config } from './config';

interface Activity {
    type: string;
    username: string;
    version: Version;
    timestamp: string;
    environment: string | undefined;
    // description: string | null;
}

interface Version {
    version: string;
    status: string | null;
}

interface Repo {
    repo: string;
    accessUsers: string[];
    activities: Activity[];
}

export async function fetchGithubData() {
    const { token, organization } = config.github;

    const repos: Repo[] = [];

    const octokit = new Octokit({
        auth: token,
    })
    
    try {
        const repoResponse = await octokit.request('GET /orgs/{org}/repos', {
        org: organization,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
        })
        for (const rep of repoResponse.data) {
            const collaborators: string[] = [];
            const activities: Activity[] = [];
            const collaboratorResponse = await octokit.request('GET /repos/{owner}/{repo}/collaborators', {
                owner: organization,
                repo: rep.name,
                headers: {
                  'X-GitHub-Api-Version': '2022-11-28'
                }
              })
            for (const collaborator of collaboratorResponse.data) {
                if (collaborator.login) {
                    collaborators.push(collaborator.login);
                }
            }

            const deploymentResponse = await octokit.request('GET /repos/{owner}/{repo}/deployments', {
                owner: organization,
                repo: rep.name,
                headers: {
                  'X-GitHub-Api-Version': '2022-11-28'
                }
              })
            for (const deployment of deploymentResponse.data) {
                let user = '';
                if (deployment.creator) {
                    user = deployment.creator.login;
                }
                const statusResponse = await octokit.request('GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses', {
                    owner: organization,
                    repo: rep.name,
                    deployment_id: deployment.id,
                    headers: {
                      'X-GitHub-Api-Version': '2022-11-28'
                    }
                  })
                for (const status of statusResponse.data) {
                    const versionDetails = {
                        version: deployment.ref,
                        status: status.state,
                    }
                    const activitiyDetails = {
                        type: 'deployment',
                        username: user,
                        version: versionDetails,
                        timestamp: status.created_at,
                        environment: status.environment,
                        // description: deployment.description
                    }
                    activities.push(activitiyDetails);
                }
            }

            const repoDetails = {
                repo: rep.name,
                accessUsers: collaborators,
                activities
            }
            repos.push(repoDetails);
        }
        return repos;
    } catch (error) {
        console.log('Error fetching Github data', error);
    }

}
