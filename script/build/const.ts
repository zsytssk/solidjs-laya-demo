import * as path from 'path';
import { readFile } from '../zutil/ls/asyncUtil';

export let project_path;
export let dist_path;

export async function intConfig(config_path: string) {
    const config_raw = await readFile(config_path);
    const config = JSON.parse(config_raw);
    project_path = process.cwd();
    dist_path = path.resolve(config.dist_path);
}
