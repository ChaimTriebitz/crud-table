const express = require('express')
const router = express.Router()
const { get, createMany, create, update, remove } = require('../controllers/lenders.js')
const { protect } = require('../middleware/auth')

router.route('/').get(get)

router.route('/createMany').post(protect, createMany)
router.route('/create').post(protect, create)
router.route('/update/:id').put(protect, update)
router.route('/remove/:id').delete(protect, remove)

module.exports = router
