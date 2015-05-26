regex = require('./regex.js');
Convert = require('gm').subClass({imageMagick: true});

exports.processor = function (request) {

    var payload = request.payload;
    var path = request.route.path;
    var id;

    // get the parameter with key id (e.g. tripid)
    for (var key in request.params) {
        if (key.match(/^.*id$/)) {
            id = request.params[key]
            break;
        }
    }

    if (!id) {
        // TODO: raise error
        console.log('eeerrrrroooooooor')
    }

    // create route (e.g. /api/v1/)
    var route = path.substring(0, path.lastIndexOf('/'));

    if (!route) {
        // TODO: raise error
        console.log('eeerrrrroooooooor')
    }


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
        },

        /**
         * Creates an object containing all relevant information for the picture, which will be uploaded
         * @param name of the file which will be saved in the database. (With or without extension)
         * @param route
         * @returns {{}}
         */
        createFileInformation: function (name) {
            var file = {};
            var ext = payload.file.hapi.headers['content-type'].match(regex.imageExtension);

            name = name.split('.')[0];
            file.filename = name + '.' + ext;
            file.thumbnailName = name + '-thumb.' + ext;

            file.imageLocation = {
                picture: route + '/' + id + '/' + file.filename,
                thumbnail: route + '/' + id + '/' + file.thumbnailName
            };

            return file;
        }

    }
};