var regex = require('./');
var assert = require('assert');


// positive tests
assert(regex.imageContentType.test("image/png"));
assert(regex.imageContentType.test("image/jpg"));
assert(regex.imageContentType.test("image/jpeg"));


assert(regex.imageExtension.test("png"));
assert(regex.imageExtension.test("jpg"));
assert(regex.imageExtension.test("jpeg"));

// negative tests
assert(!regex.imageContentType.test("image/gif"));
assert(!regex.imageExtension.test("gif"));

