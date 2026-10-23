const getToken = (req) =>{
    const authHeader = req.headers.authorization
    const [scheme, token] = authHeader.split(" ")
    return scheme === 'Bearer' ? token : null
}

module.exports = getToken