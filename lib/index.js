#!/usr/bin/env iojs
/* globals Promise */

const LINUX = 'linux';
const MACOS = 'darwin';
const LINUXBIN = 'fswebcam';
const MACOSBIN = 'imagesnap';

var program = require('commander'),
    exec = require('child_process').exec,
    platform = process.platform,
    argv = process.argv;

program
    .version('0.0.1')
    .usage('<keywords>')
    .parse(argv);
    
var checkBin, bin;

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

checkBin = new Promise(function (resolve, reject) {
    exec(`command -v ${bin} >/dev/null 2>&1`, function callback(error, stdout, stderr){
        if (error) {
            return reject(bin);
        }
        resolve(bin);
    }); 
});

checkBin.then(function(bin) {
    
}).catch(function(bin) {
    console.log(`Unable to find ${bin}. Please install first.`);
});