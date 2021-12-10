/** @utils toFixed num 去掉数字后面不需要的0 */
function toFixedNum(num: number, count: number) {
    let str = `${num}`;
    const pointIndex = str.indexOf('.');
    if (pointIndex !== -1) {
        str = str.substring(0, pointIndex + count + 1);

        // 去掉末尾不需要的0
        const str_arr = str.split('');
        for (let len = str_arr.length, i = len - 1; i >= 0; i--) {
            const item = str_arr[i];
            if (item !== '0' && item !== '.') {
                break;
            }
            str_arr.splice(i, 1);
        }
        str = str_arr.join('');
    }
    return str;
}
