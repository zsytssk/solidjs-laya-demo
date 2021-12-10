import * as path from 'path';

import { listenLocal } from '../zutil/utils/utils';
import { test, build, afterBuild } from './buildUtils';
import { intConfig } from './const';

const type = process.argv.slice(2)[0] || 'buildMap';

export const build_tips = [`1.编译代码(prod)`, `2.本地编译代码(test)`];

const buildMap = {
    '1': async () => {
        await build();
        await afterBuild();
    },
    '2': async () => {
        await build('test');
        await afterBuild(false);
    },
};

const config_path = path.resolve(__dirname, './config.json');

const actionMap = {
    async buildMap() {
        for (let i = 0; i < 50; i++) {
            const listen_type = await listenLocal(build_tips);
            console.time(`buildType:${listen_type}, costTime:`);
            if (buildMap[listen_type]) {
                await buildMap[listen_type]();
            }
            console.timeEnd(`buildType:${listen_type}, costTime:`);
        }
    },
    async test() {
        await test();
    },
};

export async function main() {
    await intConfig(config_path);
    console.log(type);
    console.time('AllCostTime');
    await actionMap[type]();
    console.timeEnd('AllCostTime');
}

main();
