const { expect } = require('chai');
const del = require('del');
const { promisify } = require('util');
const exec = require('cp-sugar').exec;
let { mkdir, writeFile, unlink } = require('fs');

mkdir = promisify(mkdir);
writeFile = promisify(writeFile);
unlink = promisify(unlink);

describe('isNewer', () => {
    beforeEach(async () => {
        await del('tmp');
        await mkdir('tmp');
        await mkdir('tmp/src');
        await mkdir('tmp/dest');
    });

    afterEach(async () => {
        await del('tmp');
    });

    it('Should execute specified command if source files are updated', async () => {
        const run = () =>
            exec('node bin/index.js "tmp/src,tmp/more-src.js" "tmp/dest" "node test/cmd.js"');

        const write = async path => {
            await writeFile(path, '');
            await new Promise(resolve => setTimeout(resolve, 1000));
        };

        await write('tmp/src/file1.js');
        await write('tmp/dest/file1.js');
        let stdout = await run();
        expect(stdout).not.contains('==HEY==');

        await write('tmp/src/file2.js');
        stdout = await run();
        expect(stdout).contains('==HEY==');
        expect(stdout).contains('- tmp/src/file2.js');

        await write('tmp/dest/file1.js');
        stdout = await run();
        expect(stdout).not.contains('==HEY==');

        await write('tmp/src/file1.js');
        await write('tmp/src/file2.js');
        await write('tmp/src/file3.js');
        stdout = await run();
        expect(stdout).contains('==HEY==');
        expect(stdout).contains('- tmp/src/file1.js');
        expect(stdout).contains('- tmp/src/file2.js');
        expect(stdout).contains('- tmp/src/file3.js');

        await write('tmp/more-src.js');
        stdout = await run();
        expect(stdout).contains('==HEY==');
        expect(stdout).contains('- tmp/more-src.js');
    });
});
