import * as path from 'path';

import { ParseFileInfo } from '.';
import { injectPropsTypePool } from '../uiToJsx';

export type FileInfo = {
    dist_path: string;
    file_path: string;
};

export function parseUIView(data: ParseFileInfo, file_info): ParseFileInfo {
    const { info, import_map } = data;

    let isLayaCom = true;
    let new_name = info.name;
    if (new_name === 'UIView') {
        isLayaCom = false;
        const source = info.props.source;
        const { com_name, rel_path } = parseUIViewInfo(source, file_info);
        delete info.props.source;
        new_name = com_name;
        injectPropsTypePool(source, info.props);
        import_map[rel_path] = [com_name];
    }

    const children = [];
    for (const item_info of info.children) {
        const { info: new_item_info } = parseUIView(
            {
                info: item_info,
                import_map,
            },
            file_info,
        );

        children.push(new_item_info);
    }

    return {
        info: { ...info, isLayaCom, children, name: new_name },
        import_map,
    };
}

export function parseUIViewInfo(view_path: string, file_info: FileInfo) {
    const { dist_path, file_path } = file_info;

    const file_name = path.basename(view_path).split('.')[0];
    const first_char = file_name[0];
    const upper_char = first_char.toUpperCase();
    const com_name = file_name.replace(first_char, upper_char);

    const file_folder_path = path.dirname(file_path);
    const abs_view_path = path.resolve(dist_path, view_path);
    let rel_path = path.relative(file_folder_path, abs_view_path);

    if (!rel_path.startsWith('.')) {
        rel_path = './' + rel_path;
    }
    rel_path = rel_path.replace('.scene', '');

    return { com_name, rel_path };
}
