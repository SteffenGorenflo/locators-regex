var Joi = require('joi');
var regex = require('./regex.js');
var basicImageSchema = {

    // content type provided by hapi must be an image
    file: Joi.object({
        hapi: {
            headers: {
                'content-type': Joi.string()
                    .regex(regex.imageContentType)
                    .required()
            }
        }
        // don't specify other values
    }).options({allowUnknown: true}).required()
        // apply meta info for hapi swagger
        .meta({swaggerType: 'file'})
};

var validCoord = Joi.number().integer().required();

// extend basic Schema
basicImageSchema.width = validCoord;
basicImageSchema.height = validCoord;
basicImageSchema.xCoord = validCoord;
basicImageSchema.yCoord = validCoord;

// export the image schema
exports.basicImageSchema = basicImageSchema;