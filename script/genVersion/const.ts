import { readFile } from '../zutil/ls/asyncUtil';

export let project_folder;
export let bin_js;
export let bin;
export let exclude_files;
export let laya_assets;
export let include;
export let laya_pages;
export let bin_res;
export let version_pos;

export async function intConfig(config_path: string) {
    const config_raw = await readFile(config_path);
    const config = JSON.parse(config_raw);
    project_folder = process.cwd();
    bin_js = config.bin_js;
    bin_res = config.bin_res;
    exclude_files = config.exclude;
    laya_assets = config.laya_assets;
    laya_pages = config.laya_pages;
    include = config.include;
    bin = config.bin;
    version_pos = config.version_pos;
}
