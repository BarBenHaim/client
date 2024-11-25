const path = require('path')

module.exports = {
    paths: function (paths, env) {
        // Set the build output directory to `../backend/public`
        paths.appBuild = path.resolve(__dirname, '../moveo-backend/public')
        return paths
    },
}
