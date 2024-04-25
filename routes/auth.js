const express = require('express');
const { SdkManagerBuilder } = require('@aps_sdk/autodesk-sdkmanager');
const { AuthenticationClient, Scopes } = require('@aps_sdk/authentication');
const { APS_CLIENT_ID, APS_CLIENT_SECRET } = process.env;

let router = express.Router();
let sdkManager = SdkManagerBuilder.create().build();
let auth = new AuthenticationClient(sdkManager);

router.get('/token', async function(req, res, next) {
    try {
        const credentials = await auth.getTwoLeggedToken(APS_CLIENT_ID, APS_CLIENT_SECRET, [Scopes.ViewablesRead]);
        res.json(credentials);
    } catch(err) {
        next(err);
    }
});

module.exports = router;
