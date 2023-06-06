import { Octokit } from "octokit";
import { config } from './config';

interface Activity {
    type: string;
    user: string;
    timestamp: string;
}

interface Repo {
    name: string;
    accessUsers: string[];
    // activities: Activity[];
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
        // I would like to add the name field of the response.data into the repos array
        for (const rep of repoResponse.data) {
            // const contributors: string[] = [];
            // const contributorsResponse = await octokit.request('GET /repos/{owner}/{repo}/contributors', {
            //     owner: organization,
            //     repo: rep.name,
            //     headers: {
            //         'X-GitHub-Api-Version': '2022-11-28'
            //     }
            // })
            const collaborators: string[] = [];
            const collaboratorResponse = await octokit.request('GET /repos/{owner}/{repo}/collaborators', {
                owner: organization,
                repo: rep.name,
                headers: {
                  'X-GitHub-Api-Version': '2022-11-28'
                }
              })
            // for (const contributor of contributorsResponse.data) {
            //     if (contributor.login) {
            //         contributors.push(contributor.login);
            //     }
            // }
            for (const collaborator of collaboratorResponse.data) {
                if (collaborator.login) {
                    collaborators.push(collaborator.login);
                }
            }
            const repoDetails = {
                name: rep.name,
                accessUsers: collaborators,
            }
            repos.push(repoDetails);
        }
        return repos;
    } catch (error) {
        console.log('Error fetching Github data', error);
    }

}
