import { Handler } from 'laya/utils/Handler';

export function convertHandler<T>(key: string, value: any, ele: T) {
    if (key === 'selectHandler') {
        const oriValue = value;
        return new Handler(null, (index: number) => {
            oriValue(index, ele);
        });
    }
    if (key === 'renderHandler') {
        const oriValue = value;
        return new Handler(null, (box: T, index: number) => {
            oriValue(box, index, ele);
        });
    }

    return value;
}
