import { createRenderEffect, createSignal, JSX, Match, Switch } from 'solid-js';

import { LayaBox, LayaImage, LayaProgressBar } from 'customRenderer';
import { Pop } from 'customRenderer/Component/pop';

import { res } from '@app/res';
import { loadRes } from '@app/utils/layaUtils';

type Props = {
    res: any[];
    onLoad: () => void;
};

let res_loaded = false;

export type Com = () => JSX.Element;
export const LoadingWrap = (Com, res: any[]) => () => {
    const [loading, setLoading] = createSignal(true);

    return (
        <Switch
            fallback={
                <Loading
                    res={[...res]}
                    onLoad={() => {
                        setLoading(false);
                    }}
                />
            }
        >
            <Match when={!loading()}>
                <Com />
            </Match>
        </Switch>
    );
};

export function Loading(props: Props) {
    const [value, setValue] = createSignal(0);

    createRenderEffect(async () => {
        if (!res_loaded) {
            await loadRes([...res.loading]);
            res_loaded = true;
        }
        loadRes(props.res, (progress: number) => {
            setValue(progress);
        }).then(() => {
            props.onLoad();
        });
    });

    return (
        <Pop width={1920} height={750} visible={true} name="loading">
            <LayaBox width={1920} height={750} x={0} y={0}>
                <LayaBox
                    top={0}
                    right={0}
                    left={0}
                    bottom={0}
                    bgColor="#f7f7f7"
                />
                <LayaImage y={171} centerX={0} skin="images/loading/logo.png" />
                <LayaProgressBar
                    y={545}
                    width={681}
                    centerX={0}
                    skin="images/loading/exp.png"
                    sizeGrid="0,128,0,18"
                    height={22}
                    value={value()}
                />
            </LayaBox>
        </Pop>
    );
}
