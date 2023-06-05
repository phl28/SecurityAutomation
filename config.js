"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    mongoAtlas: {
        // this is my own keys, need to update with organisation keys later
        publicKey: 'vvdortzc',
        privateKey: '7053ed43-7adf-4803-878c-a07e5a9b6e21',
    },
    meteorGalaxy: {
        apiKey: 'KFkCkXi3eD6xYjqKs-gahg6Ao3mgY42yHLC',
        username: 'csoftware',
    },
    github: {
        token: 'YOUR_GITHUB_ACCESS_TOKEN',
        organization: 'YOUR_GITHUB_ORGANIZATION',
    },
    azure: {
        clientId: 'YOUR_AZURE_CLIENT_ID',
        clientSecret: 'YOUR_AZURE_CLIENT_SECRET',
        tenantId: 'YOUR_AZURE_TENANT_ID',
    },
    csvFilePath: './output.csv',
};
