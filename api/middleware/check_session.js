module.exports.checkSession = (req, res, next) => {
    const sess = req.session.uid
    if( sess ){
        console.log(sess);
        next();
    }
    else{
        return res.status(401).json({ message : "Auth Fail" });
    }
}

module.exports.checkOwner = (req, res, next) => {
    const sess = req.session
    if( sess.device_id == req.params.username )
        next()
    
    else
        return res.status(401).json({error: 'Auth Fail'})
}