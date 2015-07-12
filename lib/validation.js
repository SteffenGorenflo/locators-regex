var Joi = require('joi');
var regex = require('./regex.js');
var basicImageSchema = Joi.object().keys({

    // content type provided by hapi must be an image
    file: Joi.object().keys({
        hapi: Joi.object().keys({
            headers: Joi.object().keys({
                'content-type': Joi.string()
                    .regex(regex.imageContentType)
                    .required()
            }).required()
        }).required()
        // don't specify other values
    }).options({allowUnknown: true}).required()
        // apply meta info for hapi swagger
        .meta({swaggerType: 'file'})
});

var validCoord = Joi.number().integer().required();

// extend basic Schema
var exportSchema = basicImageSchema.keys({
    width: validCoord,
    height: validCoord,
    xCoord: validCoord,
    yCoord: validCoord
});

// export the image schema
exports.basicImageSchema = exportSchema;

exports.imageUtilitySchema = Joi.object().keys({
    path: Joi.string().required(),
    contentType: Joi.string().regex(regex.imageContentType).required(),
    stream: Joi.object({
        pipe: Joi.func().required()
    }).unknown()
});