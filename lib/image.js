'use strict';
var regex = require('./regex.js');
var validation = require('./validation.js');
var Convert = require('gm').subClass({imageMagick: true});
var Joi = require('joi');

exports.processor = function (options) {

    var result = Joi.validate(options, validation.imageUtilitySchema);

    if (result.error) {
        return {error: result.error};
    }

    var path = options.path;
    var contentType = options.contentType;
    var stream = options.stream;

    // create route (e.g. /api/v1/)
    var route = path.match(regex.routePrefix);

    if (!route) {
        console.log('Error: unable to extract route from hapi request object');
        route = 'empty';
    }


    return {
        /**
         * Crops the incoming stream with the provided  data
         * and resize the image with the given parameters.
         *
         * @param crop parameter
         * @param resize parameter
         * @returns ReadableStream
         */
        createCroppedStream: function (crop, resize) {
            return Convert(stream)
                .crop(crop.width, crop.height, crop.xCoord, crop.yCoord)
                .resize(resize.x, resize.y)
                .interlace('Line') // progressive rendering
                .stream();
        },

        /**
         * Creates an object containing all relevant information for the picture, which will be uploaded
         * @param name of the file which will be saved in the database. (With or without extension)
         * @param route
         * @returns {{Content-Type: *, name: *},filename: *, thumbnailName: *, imageLocation: {picture: *, thumbnail: *}}
         */
        createFileInformation: function (name, pathPrefix, id) {
            var file = {};
            var ext = contentType.match(regex.imageExtension);

            // remove extension (if present)
            name = name.split('.')[0];

            file.filename = name + '.' + ext;
            file.url = route + pathPrefix + '/' + id + '/' + file.filename;
            if (pathPrefix === 'locations') {
                file.location = {
                    images: {
                        picture: file.url
                    }
                };
            } else if (pathPrefix === 'users') {
                file.location = {
                    picture: file.url
                };
            }
            file.attachmentData = {
                'Content-Type': contentType,
                name: file.filename
            };

            return file;
        }

    };
};

exports.stripHapiRequestObject = function (request) {

    return {
        cropping: {
            width: request.payload.width,
            height: request.payload.height,
            xCoord: request.payload.xCoord,
            yCoord: request.payload.yCoord
        },
        options: {
            path: request.route.path,
            contentType: request.payload.file.hapi.headers['content-type'],
            stream: request.payload.file
        }
    };
};
