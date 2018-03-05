
function middleware(req, res, next){
    if (req.query.api_key != 'i-am-very-secure') {
	return res.status(401).json("I need an API key.");
    } else {
	next();
    }
}

module.exports = middleware;
