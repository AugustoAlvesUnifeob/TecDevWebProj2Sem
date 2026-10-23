const authorizeRoles = (...roles) => (req, res, next) => {
    if(!req.user || !roles.includes(Number(req.user.tipo))){
        return res.status(403).json({message: 'Acesso não autorizado'})
    }

    return next()
}

module.exports = authorizeRoles
