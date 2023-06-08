import { App } from 'octokit/';
import { config } from './config';

interface SecurityAdvisory {
    summary: string;
    severity: string;
    vulnerabilities: vulnerability;
    timestamp: string;
}

interface vulnerability {
    severity: string;
    vulnerableVersionRange: string;
}

export async function fetchGithubSecurityData() {
    const { organization, appId, privateKey, installationId } = config.github;

    const app = new App ({
        appId: appId,
        privateKey: privateKey,
    })

    const octokit = await app.getInstallationOctokit(installationId);
    try {
        const alertResponse = await octokit.request('GET /orgs/{org}/dependabot/alerts', {
            org: organization,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28'
            }
        })
        const alerts: SecurityAdvisory[] = [];
        for (const alert of alertResponse.data) {
            // const vulnerabilities: vulnerability[] = [];
            // for (const vulnerability of alert.security_advisory.vulnerabilities) {
                const vulnerabilityDetails = {
                    severity: alert.security_advisory.vulnerabilities[0].severity,
                    vulnerableVersionRange: alert.security_advisory.vulnerabilities[0].vulnerable_version_range,
                }


            const alertDetails = {
                summary: alert.security_advisory.summary,
                severity: alert.security_advisory.severity,
                vulnerabilities: vulnerabilityDetails,
                timestamp: alert.created_at,
            }
            alerts.push(alertDetails);
        }
        return alerts;
    } catch (error) {
        console.error(error);
    }
}

// auth: 'MIIEpQIBAAKCAQEA6f2CLR1ehHGDJMCCVAu9iMPPkoiPhn7vRCFl+zPB05wkrzEnyWsn9xzCC7wsxEFvI90tNi1oSbC2aiVdcWEOmNNyOCDvcPsju5TURXCx5m4Gsg8ElSkZQlkkqLTFTydkfx9EjLoxBGdbE+dY3jmDlLUwTwEPvQh+ZDw7mw1w4Nk2zsNRrJA4x4PdvPbM1QZBTLA3cWCWpHI9MiQ/yITGxsZYzglsolWHEZhipnL17yplsX0QOEg5aIh6Ua+xG+KAAiaWw0k+LDbIK5bu7keSna79xjc0tmIm29gs0J8RiER8OH3QWlVVHsajPn9cOpXlyxieS563ffaxvcm7kHYSAQIDAQABAoIBAQCO0j/czapdaPPFQQPLzQa5LdvK8zO3wk7E5SXcOHE8enghvv0sAg341ULT6t3gRJhT6bKo+PpI0GXnUDtC8xz3x0hWXjQIYCIlYuhWIj1UCyBnGqePa/CRANxRZVVxxPegaDNtOlClAXkkIvepXK2l3RpJfrpehYqwH9u5/nBBrOi73gga4p7yrem55HK02TOFETiw3VLYm+1+3Ac5FEfTfWhfC/fH647XfeP9+Ss0V/FeO+KJPjX1UJ6MPoeaHngr0rwjzirfUJzO61Ej5ngJPtNLXsGGCS9+xFLKCLZpFLIZO2umjvuOKgifqvp3HaBbjus+8443H7WFnT9kzoepAoGBAP4aefkXsrQjiCLVj4HmF8+qPbcJlnrk5Q/6LDlPUOJYTmn7sR2m1L7bqp4V0DEW+C7+LX0R58C+gAyNgJ/Ah1E+rTMCAuJ9kVgURHiC1lRehgPxrk2LL8TVA2O+dLSQTQwlGGKbkXxhFmkfq7zwXQ7g+bBCXoX0dSaRXWg6swSrAoGBAOu8mefGXluIkwqh45ikiskkXmvCbzjULdipOHt6ZW7OjuVVnO7zFdaqzs86S/TEuJIF0f7Pl6eNINaJUA2ABqDUYFdwRAY5ZQSUWHCC6zv4YwsLSkUfr4Z3fgjCHxjM8Nnz2U72fUh1kQ44dBmJOErhx7+MuHy6oWWptg5ibwwDAoGBAPs3Ac+Z9jrRxg1qRW6PJItSK6GCARuOoEejdYVTPQwJcbyl8Pz3quzmD1ArEKD3rHYJJL+5q/2KWN4QJ1HI7f8Mj/8VxfRVYBRMNUVPVMYkjSnpDgHr0VYvoiJCcO7ymrmfEvSqCLOG6LkVbpxkphvHoBL6Cqk0fX2byVT6c3HxAoGAY4z2AacH2efHEMpk7uUtptuw9BjcF0ejRMfRjnOVukGIntiUuWP2aP0g8OpRgUBCIYhLsivAg4VZxL+gCtNx+SE2vjYuw+IhAtoSrxDafizaxqMx7hb/bO2xT8mKkFKbs68CqhH1vk/HvhWhEdec6iKG1CF9F09JMUGGHHT9KDkCgYEAiov2Z35ps/yrZXqsFfrx0l14YuTQU/a8Y7K4EM3zLjczQ7koegIUZVws37g3eAaBLbRz8nt+3qyJ38tweWxkPnFbsy2Q7l5iP7G828e8mZHZeRxyEbGAUpjNf+qCd7Rz3MXIirrMMAmT96Rwa+3f2BI7DAvpyuyAteDlmfmY+Bk=',