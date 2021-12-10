import * as path from 'path';
import { exists } from '../zutil/ls/asyncUtil';
import { excuse } from '../zutil/ls/exec';
import { calcClosestDepth } from '../zutil/ls/pathUtil';
import {
    bin,
    bin_js,
    bin_res,
    exclude_files,
    include,
    laya_assets,
    laya_pages,
    project_folder,
} from './const';

export async function listBinFiles() {
    const files = await findOriAllFiles();
    let result = [];
    for (const file of files) {
        // console.log(file, isExcludeFile(file), isIncludeFile(file));
        if (isExcludeFile(file)) {
            continue;
        }
        if (!isIncludeFile(file)) {
            continue;
        }
        try {
            const target = await findTargetFile(file);
            if (Array.isArray(target)) {
                result = result.concat(target);
            } else {
                result.push(target);
            }
        } catch (err) {
            console.error(err);
        }
    }
    result = result.filter((item, index) => {
        return result.indexOf(item) === index;
    });

    return result;
}
export async function findOriAllFiles() {
    const files_str = (await excuse(`git ls-tree --full-tree -r HEAD`, {
        path: project_folder,
    })) as string;
    const list = files_str.split('\n');
    list.pop();
    const result: string[] = [];
    for (const item of list) {
        const item_arr = item.split(/\s+/);
        result.push(item_arr[item_arr.length - 1]);
    }
    return result;
}
async function findTargetFile(ori_file: string) {
    // 目标文件名 == 源文件名 ||  合并
    const bin_file = await findBinFile(ori_file);
    if (bin_file) {
        return bin_file;
    }

    // js + ui
    if (isScriptFile(ori_file) || isUIFile(ori_file)) {
        return [bin_js];
    }

    throw new Error(`cant find target file for ${ori_file}`);
}

function isScriptFile(ori_file: string) {
    if (ori_file.match(/(\.ts|\.js|\.json)$/)) {
        return true;
    }
    if (ori_file.match(/^src/)) {
        return true;
    }
    if (ori_file.match(/^libs/)) {
        return true;
    }
    if (ori_file.match(/^test/)) {
        return true;
    }
    return false;
}
function isUIFile(ori_file: string) {
    if (ori_file.match(/^laya\/pages\//)) {
        return true;
    }
    return false;
}
async function findBinFile(ori_file: string): Promise<string | string[]> {
    /** bin 文件夹中存在的文件 */
    if (ori_file.indexOf(`${bin}/`) === 0) {
        if (await exists(path.resolve(project_folder, ori_file))) {
            return ori_file;
        }
    }

    /** laya/assets 中直接copy到 bin 文件 */
    if (ori_file.indexOf(laya_assets) === 0) {
        const assets_file = ori_file.replace(laya_assets, bin);
        if (await exists(path.resolve(project_folder, assets_file))) {
            return assets_file;
        }
    }
    /** laya/pages  中直接copy到 bin 文件 */
    if (ori_file.indexOf(laya_pages) === 0) {
        const pages_file = ori_file.replace(laya_pages, bin);
        if (await exists(path.resolve(project_folder, pages_file))) {
            return pages_file;
        }
    }

    const bin_folder = path.dirname(ori_file.replace(laya_assets, bin_res));
    const assets_atlas = `${bin_folder}.atlas`;
    const assets_json = `${bin_folder}.json`;
    const assets_png = `${bin_folder}.png`;

    if (await exists(path.resolve(project_folder, assets_json))) {
        return [assets_json, assets_png];
    }
    if (await exists(path.resolve(project_folder, assets_atlas))) {
        return [assets_atlas, assets_png];
    }
}

function isExcludeFile(ori_file: string): boolean {
    ori_file = path.resolve(project_folder, ori_file);
    if (exclude_files) {
        for (let item of exclude_files) {
            item = path.resolve(project_folder, item);
            if (calcClosestDepth(ori_file, item) > -1) {
                return true;
            }
        }
        return false;
    }
    return false;
}
function isIncludeFile(ori_file: string): boolean {
    ori_file = path.resolve(project_folder, ori_file);
    if (include) {
        for (let item of include) {
            item = path.resolve(project_folder, item);
            if (calcClosestDepth(ori_file, item) > -1) {
                return true;
            }
        }
        return false;
    }

    return true;
}
