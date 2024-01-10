//to  validate schemas

const Joi = require('joi');

// use authSchema for validation of user data registeration
// import as a object , as there can be many
const authSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(2).required(),
});

module.exports = {
    authSchema,
};
