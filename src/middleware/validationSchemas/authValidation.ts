import Joi from 'joi';

const registerUser = Joi.object({
    username: Joi.string().min(3).required().label('Username'),

    email: Joi.string().email().required().label('Email'),

    password: Joi.string().min(6).required().label('Password'),

    passwordConfirmation: Joi.any()
        .equal(Joi.ref('password'))
        .required()
        .label('Confirm password')
        .messages({ 'any.only': '{{#label}} does not match' }),
});

const login = Joi.object({
    email: Joi.string().required(),

    password: Joi.string().required(),
});

export default { registerUser, login };
