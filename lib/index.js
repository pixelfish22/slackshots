#!/usr/bin/env iojs
/* globals Promise */


const LINUX = 'linux';
const MACOS = 'darwin';
const LINUXBIN = 'fswebcam';
const MACOSBIN = 'imagesnap';

var program = require('commander'),
    fs = require("fs"),
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

checkDir = new Promise(function (resolve, reject) {
    fs.exists('.git/', function(exists) {
        exists ? resolve() : reject('Unable to find .git directory.');
    })
});

checkRepo = new Promise(function (resolve, reject) {
    exec('git status', function callback(error, stdout, stderr){
        if (error) {
            return reject('This does not appear to be a tracked git repository.');
        }
        resolve();
    });
});

checkBin = new Promise(function (resolve, reject) {
    exec(`command -v ${bin} >/dev/null 2>&1`, function callback(error, stdout, stderr){
        if (error) {
            return reject(`Unable to find ${bin}. Please install first.`);
        }
        resolve(bin);
    }); 
});

Promise.all([checkDir, checkRepo, checkBin]).then(function() {
    console.log('Checks passed');
}).catch(function(err) {
    console.log(err);
});

