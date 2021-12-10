import { createSignal } from 'solid-js';

import { LayaButton, LayaImage, LayaSprite, LayaText } from 'customRenderer';
import { Scene } from 'customRenderer/Component/scene';
import { createResizeEffect } from 'customRenderer/effect';
import { Box } from 'laya/ui/Box';

import { setCurSceneSignal } from '@app/main';
import { res } from '@app/res';
import { LoadingWrap } from '@app/view/loading';

export const Game = LoadingWrap(GameInner, res.game);

function GameInner(props: any) {
    const [quitSignal, setQuitSignal] = createSignal<Box>();

    createResizeEffect((width: number) => {
        // 直接使用laya对象
        const quit_node = quitSignal();
        if (!quit_node) {
            return;
        }
        quit_node.right = (1920 - width) / 2 + 58;
    });

    return (
        <Scene
            width={1920}
            height={750}
            center={true}
            autoDestroyAtClosed={true}
            {...props}
        >
            <LayaImage
                top={0}
                skin="images/game/bg3.jpg"
                right={0}
                left={0}
                bottom={0}
            />
            <LayaImage
                y={128}
                x={173.5}
                width={997}
                texture="images/game/bg1.jpg"
                height={577}
                centerX={0}
            >
                <LayaText
                    y={-51}
                    x={256}
                    text="想象下这是个牛B的游戏"
                    fontSize={40}
                    color="#311515"
                />
            </LayaImage>
            <LayaButton
                y={33}
                right={58}
                ref={setQuitSignal}
                stateNum={1}
                onClick={() => setCurSceneSignal('hall')}
                skin="images/game/btn_quit.png"
            />
        </Scene>
    );
}
