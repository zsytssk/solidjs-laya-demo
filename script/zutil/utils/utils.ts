import * as readline from 'readline';

export function sleep(time: number) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(undefined);
        }, time);
    });
}

/** 创建随机id */
export function createRandomString() {
    return Math.random().toString().replace('0.', '');
}

// 监听本地
export async function listenLocal(list: string[]) {
    let build_tips = `请选择要执行的命令\n$1 > `;
    let build_tip_str = '';
    for (const item of list) {
        build_tip_str += ` ${item}\n`;
    }
    build_tips = build_tips.replace('$1', build_tip_str);

    return new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        console.log('--------------------');
        console.log();

        rl.question(build_tips, (answer) => {
            console.log(`选中${answer}`);
            rl.close();
            resolve(answer);
        });
    }) as Promise<string>;
}
