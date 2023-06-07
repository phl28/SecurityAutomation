import { Octokit } from 'octokit/';
import { config } from './config';

interface SecurityAdvisory {
    summary: string;
    severity: string;
    vulnerabilities: vulnerability[];
    timestamp: string;
}

interface vulnerability {
    package: string;
    severity: string;
    vulnerableVersionRange: string;
    firstPatchedVersion: string;
}

export async function fetchGithubSecurityData() {
    const { token, organization } = config.github;

    const octokit = new Octokit({
        auth: token,
    })

    try {
        const alertResponse = await octokit.request('GET /orgs/{org}/dependabot/alerts', {
            org: organization,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28'
            }
        })
        console.log(alertResponse.data)
        // const alerts: string[] = [];
        // for (const alert of alertResponse.data) {

        // }
    } catch (error) {
        console.error(error);
    }
}
