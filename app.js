'use strict';
const express = require('express');
const app = express();
const webpush = require('web-push');
const bodyParser = require('body-parser');
const url = require('url');
const vapidKeys = webpush.generateVAPIDKeys();
/*
webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);
*/


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('static'));


app.listen('3000', () => {
    console.log('listen');
});

app.get('/key', (req, res) => {
    res.send(vapidKeys.publicKey);
});

app.post('/test', (req, res) => {
    const pushSubscription = {
        endpoint: req.body.endpoint,
        keys: {
            p256dh: req.body.key,
            auth: req.body.auth
        }
    };
    const payload = JSON.stringify(req.body.message)
    const options = {
        "TTL": 20000,
        "vapidDetails": {
            "subject": 'http://localhost:3000/index.html',
            "publicKey": vapidKeys.publicKey,
            "privateKey": vapidKeys.privateKey
        }
    }
    webpush.sendNotification(
        pushSubscription,
        payload,
        options
    ).catch(console.log)
res.json({test:'OK'})
});
