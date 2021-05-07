const OSS = require('ali-oss');
const path = require('path');
const os = require('os');
const cliArgs = require('yargs').argv;

const ELECTRON_VERSION = '12.0.4';

const config = {
    region: cliArgs.REGION,
    accessKeyId: cliArgs.ACCESS_KEY_ID,
    accessKeySecret: cliArgs.ACCESS_KEY_SECRET,
    bucket: cliArgs.BUCKET,
    internal: false
}

const bin = cliArgs.TYPE === 'serialport'
            ? path.join(__dirname, '..', 'node_modules', '@serialport', 'bindings', 'build', 'Release', 'bindings.node')
            : path.join(__dirname, '..', 'node_modules', 'usb-detection', 'build', 'Release', 'detection.node')

let client = new OSS({
    region: config.region,
    accessKeyId: config.accessKeyId,
    accessKeySecret: config.accessKeySecret,
    bucket: config.bucket,
    internal: config.internal
});

function getName(binType) {
    const prefix = os.platform() === 'darwin' ? 'darwin' : os.platform() === 'win32' ? 'win32' : 'Ubuntu18.04';
    return `${binType}_${prefix}_${ELECTRON_VERSION}_x64.node`;
}


client.put(getName(cliArgs.TYPE), bin)
.catch(err => {
    console.log(err);
});
