module.exports = {
    devServer: {
        proxy: {
            '/user': {
                target: 'http://localhost:2021',
                changeOrigin: true
            },
            '/admin': {
                target: 'http://localhost:2021',
                changeOrigin: true
            },
        }
    }
}