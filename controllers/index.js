const router = require('express').Router()

//Link different routes
const apiRoutes = require('./api')

//use different routes
router.use('/api', apiRoutes)


module.exports = router