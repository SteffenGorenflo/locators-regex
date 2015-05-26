regex = require('./regex.js');
Convert = require('gm').subClass({imageMagick: true});

exports.processor = function (request) {

    var payload = request.payload;


    return {

        /**
         * Returns an object, which is needed for saving an attachment to a couchdb
         * @param filename
         * @returns {{Content-Type: *, name: *}}
         */
        getAttachmentData: function (filename) {
            return {
                'Content-Type': payload.file.hapi.headers['content-type'],
                name: filename
            }
        },

        /**
         *
         * @returns extension of the file from the request payload
         */
        getExtensionOfFile: function () {
            return payload.file.hapi.headers['content-type'].match(regex.imageExtension)
        },

        /**
         * Crops the incoming stream (payload.file) with the provided payload data
         * and resize the image with the given paramers.
         *
         * @param x resize parameter
         * @param y resize parameter
         * @returns ReadableStream
         */
        createCroppedStream: function (x, y) {
            return Convert(payload.file)
                .crop(payload.width, payload.height, payload.xCoord, payload.yCoord)
                .resize(x, y)
                .stream();
        }


    }
};