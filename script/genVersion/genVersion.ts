import md5File from 'md5-file';
import * as path from 'path';

import { write } from '../zutil/ls/write';
import { stringify } from '../zutil/utils/stringify';
import { bin, intConfig, project_folder, version_pos } from './const';
import { listBinFiles } from './listBinFiles';

const config_path = path.resolve(__dirname, './config.json');

export async function genVersion() {
    await intConfig(config_path);
    const result = {} as { [key: string]: string };
    const files = await listBinFiles();

    for (const item of files) {
        const md5 = await getFileMd5(item);
        const key = path.relative(bin, item).replace(/\\/g, '/');
        result[key] = md5;
    }
    const file_path = path.resolve(project_folder, version_pos, 'version.json');
    write(file_path, stringify(result));
}

async function getFileMd5(file: string): Promise<string> {
    return new Promise((resolve, reject) => {
        file = path.resolve(project_folder, file);
        return md5File(file)
            .then((hash) => {
                hash = hash.substr(0, 8);
                resolve(hash);
            })
            .catch((err) => {
                reject(err);
            });
    });
}
