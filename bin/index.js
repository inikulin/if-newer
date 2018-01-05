const { promisify } = require('util');
const { spawn } = require('cp-sugar');
const glob = require('globby');
let { stat } = require('fs');

stat = promisify(stat);

main();

async function main() {
    const args = process.argv.slice(2);

    if (args.length !== 3) {
        console.error('ERROR: 3 arguments expected.');
        process.exit(1);
    }

    const updatedFiles = await getUpdatedSourceFilesList(args[0], args[1]);

    if (!updatedFiles.length) return;

    console.log(`Running "${args[2]}" command because following source file were updated:`);

    for (let file of updatedFiles) {
        console.log(`   - ${file}`);
    }

    await spawn(args[2]);
}

async function getInfo(globPattern) {
    const files = await glob(globPattern);

    return await Promise.all(files.map(async path => ({ path, mtime: (await stat(path)).mtime })));
}

async function getUpdatedSourceFilesList(src, dest) {
    src = src.split(',');
    dest = dest.split(',');

    const [srcInfo, destInfo] = await Promise.all([getInfo(src), getInfo(dest)]);
    const destLastModified = destInfo.reduce((lm, i) => Math.max(lm, i.mtime), 0);

    return srcInfo.filter(i => i.mtime >= destLastModified).map(i => i.path);
}
