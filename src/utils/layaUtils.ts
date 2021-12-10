import { Laya, loader } from 'Laya';
import { AtlasInfoManager } from 'laya/net/AtlasInfoManager';
import { URL } from 'laya/net/URL';
import { Handler } from 'laya/utils/Handler';
import { Stat } from 'laya/utils/Stat';
import { WebGL } from 'laya/webgl/WebGL';

export async function layaInit(version: string) {
    Laya.init(1920, 750, WebGL);
    Laya.stage.scaleMode = 'fixedheight';
    Laya.stage.screenMode = 'horizontal';
    Laya.stage.alignV = 'top';
    Laya.stage.alignH = 'left';

    Stat.show(0, 0);

    URL.customFormat = (url: string) => {
        const version_map = URL.version || {};
        if (url.indexOf('data:image') < 0) {
            if (url.indexOf('?') < 0 && url.indexOf('?v=') < 0) {
                let v = version_map[url];
                if (!v && version) {
                    v = version;
                }
                url += '?v=' + v;
            }
        }
        return url;
    };

    const start_task: Array<Promise<unknown>> = [];
    // 激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
    const fileConfigTask = new Promise<void>((resolve, _reject) => {
        AtlasInfoManager.enable(
            'fileconfig.json',
            Handler.create(null, async () => {
                resolve();
            }),
        );
    });
    start_task.push(fileConfigTask);

    const versionPath = `./version.json?v=${version}`;
    start_task.push(loadRes([versionPath]));

    await Promise.all(start_task);

    if (versionPath) {
        URL.version = loader.getRes(versionPath);
    }
}

export type FunProgress = (progress: number) => void;
/** 加载资源... */
export function loadRes(res: string[], on_progress?: FunProgress) {
    return new Promise((resolve, _reject) => {
        let loading_fun: Handler;
        if (on_progress) {
            loading_fun = new Handler(
                null,
                (val: number) => {
                    on_progress(val);
                },
                null,
                false,
            );
        }
        const loaded_fn = new Handler(this, () => {
            setImmediate(resolve);
        });

        Laya.loader.load(res, loaded_fn, loading_fun);
    });
}
