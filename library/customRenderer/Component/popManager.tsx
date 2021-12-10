import { createSignal, For, JSX } from 'solid-js';

const [popList, setPopList] = createSignal<(() => JSX.Element)[]>([]);

export function addPop(Ele: () => JSX.Element, name) {
    setPopList((pops) => {
        const newList = [...pops, Ele];
        console.log(`test:>addPop:>${name}`, pops, newList);
        return newList;
    });
}

export function removePop(Ele, name) {
    setPopList((pops) => {
        const newList = pops.filter((item) => item !== Ele);
        console.log(`test:>removePop:>${name}`, pops, newList);
        return newList;
    });
}

export function PopManager(props: any) {
    return (
        <>
            <For each={popList()}>{(Ele) => <Ele />}</For>
            {props.children}
        </>
    );
}
