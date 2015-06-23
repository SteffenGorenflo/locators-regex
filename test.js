'use strict';
var util = require('./');
var assert = require('assert');
var Joi = require('joi');

var regex = util.regex;
var validation = util.validation;

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

// validate joi validation
var testObject = {
    width: 500,
    height: 500,
    xCoord: 0,
    yCoord: 0,
    file: {
        hapi: {
            headers: {
                'content-type': 'image/jpg'
            }
        }
    }
};
Joi.validate(testObject, validation.basicImageSchema, function (err, value) {
    assert(!err);
});

