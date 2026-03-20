import Joi from "joi";

export const resourceSchemas = {
    // POST /resources
    create: {
        body: Joi.object({
            title: Joi.string().min(3).required().messages({
                "any.required": 'Validation error: "title" is required',
                "string.empty": 'Validation error: "title" cannot be empty',
                "string.min": 'Validation error: "title" must be at least 3 characters long',
            }),

            type: Joi.string()
                .valid("documentation", "video", "article", "tool", "other")
                .required()
                .messages({
                    "any.required": 'Validation error: "type" is required',
                    "any.only": 'Validation error: "type" must be one of [documentation, video, article, tool, other]',
                }),

            url: Joi.string().uri().required().messages({
                "any.required": 'Validation error: "url" is required',
                "string.uri": 'Validation error: "url" must be a valid URL',
            }),

            description: Joi.string().min(5).required().messages({
                "any.required": 'Validation error: "description" is required',
                "string.empty": 'Validation error: "description" cannot be empty',
                "string.min": 'Validation error: "description" must be at least 5 characters long',
            }),
        }),
    },

    // GET /resources/:id
    getById: {
        params: Joi.object({
            id: Joi.number().integer().required().messages({
                "any.required": 'Validation error: "id" is required',
                "number.base": 'Validation error: "id" must be a number',
            }),
        }),
    },

    // PUT /resources/:id
    update: {
        params: Joi.object({
            id: Joi.number().integer().required(),
        }),
        body: Joi.object({
            title: Joi.string().min(3).optional(),
            type: Joi.string().valid("documentation", "video", "article", "tool", "other").optional(),
            url: Joi.string().uri().optional(),
            description: Joi.string().min(5).optional(),
        }).min(1),
    },

    // DELETE /resources/:id
    delete: {
        params: Joi.object({
            id: Joi.number().integer().required(),
        }),
    },
};