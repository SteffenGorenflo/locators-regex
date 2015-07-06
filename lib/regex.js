/**
 * To test against the content type provided by hapi.
 */
exports.imageContentType = /^image\/(?:jpg|png|jpeg)$/;

/**
 * Check against a file extension
 */
exports.imageExtension = /^jpg|png|jpeg$/;

/**
 * Get the first occurrence  of a string till the fourth slash
 * Example: /api/v1/trips/
 */
exports.routePrefix = /^\/\w*\/\w*\//;
