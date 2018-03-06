
function middleware(req, res, next){
    var apikey = process.env.PELIAS_API_KEY;
    if (req.query.api_key !== apikey) {
	return res.status(401).json('I need an API key in GET param api_key.');
    } else {
	next();
    }
}

module.exports = middleware;
