var express = require('express')

var router = express.Router()

router.get('/', function (req, res) {
    req.logout();
    res.clearCookie("username");
    res.clearCookie("fullname");
    res.clearCookie("email");
    res.clearCookie("sdt");
    res.redirect('/login');
});


module.exports = router;