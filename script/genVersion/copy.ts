import * as path from 'path';
import { cp } from '../zutil/ls/main';

const files = ['dist/genVersion.js', 'script/config.json'];
const target_folder = 'D:\\zsytssk\\job\\HonorLite\\demo\\script\\genVersion';

for (const file of files) {
    const filename = path.basename(file);
    const dist = path.resolve(target_folder, filename);
    cp(file, dist);
}
