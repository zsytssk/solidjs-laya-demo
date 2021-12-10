import {
    createRenderEffect,
    createSignal,
    onCleanup,
    splitProps,
} from 'solid-js';

import { Laya } from 'Laya';
import { LayaView } from 'customRenderer/layaCom';
import { View } from 'laya/ui/View';

export function Scene(props: ComProps & { ref: (node: View) => void }) {
    const [x, setX] = createSignal(0);
    const [local, other] = splitProps(props, ['children', 'ref']);

    createRenderEffect(() => {
        const setXFn = () => {
            if (!Laya.stage) {
                return;
            }
            const { width } = Laya.stage;
            const x = (width - 1920) / 2;
            setX(x);
        };
        Laya.stage.on(Laya.Event.RESIZE, this, setXFn);
        setXFn();

        onCleanup(() => {
            Laya.stage.off(Laya.Event.RESIZE, this, setXFn);
        });
    });

    return (
        <LayaView
            x={x()}
            width={1920}
            height={750}
            ref={local.ref}
            autoDestroyAtClosed={true}
            {...other}
        >
            {local.children}
        </LayaView>
    );
}
