var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
    res.send({test: 'hello World!'})
})

module.exports = router;