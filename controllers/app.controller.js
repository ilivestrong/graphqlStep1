module.exports = {
    getIndexPage : (req, res) => {
        if(req.user.isLoggedIn()) {
            res.send("Hey")
        }
        else {
            res.send('NOT LOGGED IN')
        }
        
    }
}