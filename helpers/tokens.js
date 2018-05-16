'use strict'

const jwt = require('jsonwebtoken');

function verifyToken(token){
    try{
        const user = jwt.verify(token, 'TDATAXI2018');

        return user;
    }
    catch(err){
        return false;
    }
}

module.exports = {
    verifyToken,
}