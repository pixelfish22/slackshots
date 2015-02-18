#!/usr/bin/env iojs

/* globals Promise */

const LINUX = 'linux';
const MACOS = 'darwin';
const LINUXBIN = 'fswebcam';
const MACOSBIN = 'imagesnap';

var program = require('commander'),
    inquirer = require('inquirer'),
    validUrl = require('valid-url'),
    fs = require('fs'),
    exec = require('child_process').exec,
    platform = process.platform,
    argv = process.argv;

program
    .version('0.0.1')
    .usage('<keywords>')
    .parse(argv);

var checkBin, bin, checkRepo, checkDir;

switch (platform) {
    case LINUX:
        bin = LINUXBIN;
        break;
    case MACOS:
        bin = MACOSBIN;
        break;
    default:
        console.log('This module is only compatible with Mac OS X or Linux');
        process.exit(1);
}

checkDir = new Promise(function(resolve, reject) {
    fs.exists('.git/', function(exists) {
        exists ? resolve() : reject('Unable to find .git directory.');
    })
});

checkRepo = new Promise(function(resolve, reject) {
    exec('git status', function callback(error, stdout, stderr) {
        if (error) {
            return reject('This does not appear to be a tracked git repository.');
        }
        resolve();
    });
});

checkBin = new Promise(function(resolve, reject) {
    exec(`command -v ${bin} >/dev/null 2>&1`, function callback(error, stdout, stderr) {
        if (error) {
            return reject(`Unable to find ${bin}. Please install first.`);
        }
        resolve(bin);
    });
});

Promise.all([checkDir, checkRepo, checkBin]).then(function() {
    return new Promise(function(response, reject) {
        inquirer.prompt([{
            type: 'input',
            name: 'webhook',
            message: 'Give me a webhook URL (See Integrations, Incoming WebHooks.)',
            validate: function(input) {
                return validUrl.isWebUri(input) === input || 'That does not appear to be a valid URI. Try again.';
            }
        }], function(answers) {
            response(answers);
        });
    });
}).catch(function(err) {
    console.log(err);
    process.exit(1);
}).then(function(answers) {
    console.dir(answers);
    process.exit();
});