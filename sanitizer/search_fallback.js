var sanitizeAll = require('../sanitizer/sanitizeAll'),
    sanitizers = {
      text: require('../sanitizer/_text_addressit')()
    };

var logger = require('pelias-logger').get('api');
var logging = require( '../helper/logging' );
var _ = require('lodash');

// middleware
module.exports.middleware = function( req, res, next ){
  // if res.data already has results then don't call the _text_autocomplete sanitizer
  // this has been put into place for when the libpostal integration way of querying
  // ES doesn't return anything and we want to fallback to the old logic
  if (_.get(res, 'data', []).length > 0) {
    return next();
  }

  // log the query that caused a fallback since libpostal+new-queries didn't return anything
  if (req.path === '/v1/search') {
    const queryText = logging.isDNT(req) ? '[text removed]' : req.clean.text;
    logger.info(`fallback queryText: ${queryText}`);
  }
  // calls to sanitize the input
  // omits check if parameters are valid since it only calls _text_addressit
  sanitizeAll.sanitize(req, sanitizers, ( err, clean ) => {
    if( err ){
      res.status(400); // 400 Bad Request
      return next(err);
    }
    next();
  });

};
