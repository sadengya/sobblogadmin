module.exports = {
    devServer: {
        proxy: {
            '/user': {
                target: 'http://127.0.0.1:2021',
                changeOrigin: true
            },
            '/admin': {
                target: 'http://127.0.0.1:2021',
                changeOrigin: true
            },
        }
    }
}