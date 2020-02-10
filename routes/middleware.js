module.exports = {
    setActiveNavbarLink: function(req, res, next) {
        switch (req.path) {
            case "/":
                res.locals.home = true;
                break;
            case "/saved":
                res.locals.saved = true;
                break;
            default:
            //nothing
        }
        next();
    }
};
