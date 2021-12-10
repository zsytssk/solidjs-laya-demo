import { ParseFileInfo } from '../parse';
import { upperFirstChar } from '../utils';
import { convertImport } from './convertImport';
import { convertObjToXml } from './convertObjToXml';
import { convertTypes } from './convertTypes';

const file_str = `
$0
$3
export function $1($5) {
$4
    return(
        $2
    );
}`;

export function convertFile(
    name: string,
    file_info: ParseFileInfo,
    type_props: Record<string, unknown>,
) {
    const { info, import_map } = file_info;

    const { jsx } = convertObjToXml(info, 2, true);

    const import_str = convertImport(import_map);
    const props_type_str = convertTypes(type_props);
    let output = file_str.replace('$0', import_str);
    output = output.replace('$1', upperFirstChar(name));
    output = output.replace('$2', jsx);
    output = output.replace('\n$3', '');
    output = output.replace('\n$4', '');
    output = output.replace('$5', `props: ${props_type_str}`);

    return output;
}
