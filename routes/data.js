const express = require('express');
const { SdkManagerBuilder } = require('@aps_sdk/autodesk-sdkmanager');
const { AuthenticationClient, Scopes } = require('@aps_sdk/authentication');
const { OssClient } = require('@aps_sdk/oss');
const { APS_CLIENT_ID, APS_CLIENT_SECRET, APS_BUCKET } = process.env;
const Issue = require('../model/issue');
const IssueTableLimit = 256;

let router = express.Router();
let sdkManager = SdkManagerBuilder.create().build();
let auth = new AuthenticationClient(sdkManager);
let oss = new OssClient(sdkManager);

const FacilityData = [
    {
        name: 'Montreal Facility',
        id: 'montreal',
        region: [
            { lat: 45.643634, lng: -73.527693 },
            { lat: 45.644899, lng: -73.526520 },
            { lat: 45.642727, lng: -73.521655 },
            { lat: 45.641473, lng: -73.522854 }
        ]
    },
    {
        name: 'El Facility',
        id: 'el',
        region: [
            { lat: 45.641858, lng: -73.522272  },
            { lat: 45.643710, lng: -73.520559 },
            { lat: 45.643289, lng: -73.519494 },
            { lat: 45.642545, lng: -73.519196 },
            { lat: 45.640949, lng: -73.520143 }
        ]
    }
];

function idToUrn(id) {
    return Buffer.from(id).toString('base64').replace(/\=/g, '');
}

function countIssues() {
    return new Promise(function(resolve, reject) {
        Issue.count({}, (err, count) => {
            if (err) {
                reject(err);
            } else {
                resolve(count);
            }
        });
    });
}

async function listObjects(bucketKey) {
    const credentials = await auth.getTwoLeggedToken(APS_CLIENT_ID, APS_CLIENT_SECRET, [Scopes.DataRead]);
    let resp = await oss.getObjects(credentials.access_token, bucketKey, { limit: 64 });
    let objects = resp.items;
    while (resp.next) {
        const startAt = new URL(resp.next).searchParams.get('startAt');
        resp = await oss.getObjects(credentials.access_token, bucketKey, { startAt, limit: 64 });
        objects = objects.concat(resp.items);
    }
    return objects;
}

router.get('/facilities', async function(req, res) {
    try {
        res.json(FacilityData);
    } catch(err) {
        res.status(500).send(err);
    }
});

router.get('/facilities/:facility', async function(req, res) {
    try {
        const objects = await listObjects(APS_BUCKET);
        const areas = {};
        for (const object of objects) {
            const match = object.objectKey.match(/^(\w+)\-(\d+)\-(\w+)\.nwd$/);
            if (match) {
                const facilityKey = match[1].toLowerCase();
                if (facilityKey === req.params.facility) {
                    const areaKey = match[2];
                    const typeKey = match[3].toLowerCase();
                    const area = areas[areaKey] = areas[areaKey] || {};
                    area[typeKey] = idToUrn(object.objectId);
                }
            }
        }
        res.json(areas);
    } catch(err) {
        res.status(500).send(err);
    }
});

router.get('/facilities/:facility/issues', function(req, res) {
    let query = {
        facility: req.params.facility
    };
    Issue.find(query, (err, issues) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(issues);
        }
    });
});

router.post('/facilities/:facility/issues', async function(req, res) {
    const { urn, partId, author, text, img, x, y, z } = req.body;
    const facility = req.params.facility;
    try {
        const numIssues = await countIssues();
        if (numIssues >= IssueTableLimit) {
            throw new Error('Cannot create more issues.');
        }
        const issue = await Issue.create({ createdAt: new Date, urn, facility, partId, author, text, img, x, y, z });
        res.json(issue);
    } catch(err) {
        res.status(500).send(err);
    }
});

module.exports = router;
