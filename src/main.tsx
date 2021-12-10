import { createSignal } from 'solid-js';

import { Laya } from 'Laya';
import { render } from 'customRenderer';
import { PopManager } from 'customRenderer/Component/popManager';

import { layaInit } from './utils/layaUtils';
import { Game } from './view/game';
import { Hall } from './view/hall';
import { Alert } from './view/pop/alert';

export const [curSceneSignal, setCurSceneSignal] = createSignal<
    'hall' | 'game'
>('hall');

function App() {
    return (
        <>
            {curSceneSignal() === 'hall' ? <Hall /> : <Game />}
            <PopManager>
                <Alert />
            </PopManager>
        </>
    );
}

layaInit(Date.now() + '').then(() => {
    render(App, Laya.stage);
});
