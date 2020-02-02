const express = require('express')
const router = express.Router()
const Location = require('../models/location.model')
const select = require('../constants/select')
const limit = require('../constants/limit')

/*
Get location list
*/
router.get('/list', (request, response) => {
    const { search } = request.query
    const query = search ? { '$text': { '$search': search }} : {}
    Location.find(query)
        .select(select.GET_LOCATION)
        .limit(limit.LOCATION_LIST)
        .then(results => response.status(200).json(results))
        .catch(error => response.status(400).json({ error }))
})

module.exports = router
