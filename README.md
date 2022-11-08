# aps-industrial-construction

![Platforms](https://img.shields.io/badge/platform-Windows|MacOS-lightgray.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D%2010.0.0-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

[![Viewer](https://img.shields.io/badge/Viewer-v6-green.svg)](http://forge.autodesk.com/en/docs/viewer/v6)
[![Data-Management](https://img.shields.io/badge/Data%20Management-v2-green.svg)](https://forge.autodesk.com/en/docs/data/v2)
[![Model-Derivative](https://img.shields.io/badge/Model%20Derivative-v2-green.svg)](https://forge.autodesk.com/en/docs/model-derivative/v2)

[Autodesk Platform Services](https://aps.autodesk.com) sample application demonstrating features relevant to the area of industrial construction.

![Screenshot](screenshot.png)

## Live demo

Master branch is deployed to https://aps-industrial-construction.autodesk.io

## Development

### Prerequisites

- Node.js v10+
- [APS](https://aps.autodesk.com) application credentials
- MongoDB database
  - for example, using the free tier of [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
  - or running MongoDB locally: https://docs.mongodb.com/manual/installation

### Setup & Running

- clone this repository
- install dependencies: `npm install`
- run server with all the required env. variables
  - for example, on macOS:
    ```bash
    export APS_CLIENT_ID=<client-id>
    export APS_CLIENT_SECRET=<client-secret>
    export APS_BUCKET=<bucket-name>
    export GOOGLE_MAPS_API_KEY=<api-key>
    export MONGODB_URL=<mongodb-connection-string>
    npm start
    ```
  - or, when using [Visual Studio Code](https://code.visualstudio.com), add this configuration to your _.vscode/launch.json_:
  ```json
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Express Server",
            "program": "${workspaceFolder}/server.js",
            "env": {
                "APS_CLIENT_ID": "<client-id>",
                "APS_CLIENT_SECRET": "<client-secret>",
                "APS_BUCKET": "<bucket-name>",
                "GOOGLE_MAPS_API_KEY": "<api-key>",
                "MONGODB_URL": "<mongodb-connection-string>"
            }
        }
  ```
- go to http://localhost:3000

### Deployment

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## License

This sample is licensed under the terms of the [MIT License](https://tldrlegal.com/license/mit-license).

## Written by

Petr Broz ([@ipetrbroz](https://twitter.com/ipetrbroz)), APS Developer Advocates
