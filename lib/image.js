'use strict';
var regex = require('./regex.js');
var Convert = require('gm').subClass({imageMagick: true});
var Joi = require('joi');

exports.processor = function (options) {

    var schema = Joi.object().keys({
        path: Joi.string().required(),
        id: Joi.string().required(),
        contentType: Joi.string().regex(regex.imageContentType).required(),
        stream: Joi.object({
            pipe: Joi.func().required()
        }).unknown()
    });

    var result = Joi.validate(options, schema);

    if (result.error) {
        return {error: result.error};
    }

    var path = options.path;
    var id = options.id;
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
                .stream();
        },

        /**
         * Creates an object containing all relevant information for the picture, which will be uploaded
         * @param name of the file which will be saved in the database. (With or without extension)
         * @param route
         * @returns {{Content-Type: *, name: *},filename: *, thumbnailName: *, imageLocation: {picture: *, thumbnail: *}}
         */
        createFileInformation: function (name) {
            var file = {};
            var ext = contentType.match(regex.imageExtension);

            name = name.split('.')[0];
            file.filename = name + '.' + ext;
            file.thumbnailName = name + '-thumb.' + ext;

            file.imageLocation = {
                picture: route + id + '/' + file.filename,
                thumbnail: route + id + '/' + file.thumbnailName
            };

            file.attachmentData = {
                'Content-Type': contentType,
                name: file.filename
            };

            return file;
        }

    };
};

exports.stripHapiRequestObject = function(request) {

    return {
        cropping: {
            width: request.payload.width,
            heigth: request.payload.heigth,
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
