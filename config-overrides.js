const path = require('path')

module.exports = {
    paths: function (paths, env) {
        paths.appBuild = path.resolve(__dirname, '../moveo-backend/public') // Ensure paths align with backend
        return paths
    },
}
