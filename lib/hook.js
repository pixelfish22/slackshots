#!/usr/bin/env iojs

/* globals Promise */

const LINUX = 'linux';
const MACOS = 'darwin';
const LINUXBIN = 'fswebcam';
const MACOSBIN = 'imagesnap';

var bin;

switch (process.platform) {
    case LINUX:
        bin = LINUXBIN;
        break;
    case MACOS:
        bin = MACOSBIN;
        break;
    default:
        console.log('slackshots is only compatible with Mac OS X or Linux');
        process.exit(1);
}

