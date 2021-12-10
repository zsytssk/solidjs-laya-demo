module.exports = {
    presets: [
        '@babel/preset-env',
        [
            'babel-preset-solid',
            {
                moduleName: 'customRenderer',
                generate: 'universal',
            },
        ],
        '@babel/preset-typescript',
    ],
    plugins: [
        [
            '@babel/plugin-transform-runtime',
            {
                corejs: 3,
                helpers: true,
                regenerator: true,
                useESModules: false,
            },
        ],
        ['@babel/plugin-transform-modules-commonjs'],
    ],
};
