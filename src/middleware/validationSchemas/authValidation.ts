import Joi from 'joi';
import User from '../../models/User';

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

const emailExists = async (email: string) => {
    const user = await User.findOne({ email: email });
    if (user)
        throw new Joi.ValidationError(
            'Email is already takenaa',
            [{ message: 'Email is already taken', path: ['email'] }],
            'email'
        );
};

const registerUser = Joi.object({
    username: Joi.string().min(3).required().label('Username'),

    email: Joi.string().email().required().label('Email').external(emailExists),

    password: Joi.string().pattern(passwordRegex).required().label('Password'),

    passwordConfirmation: Joi.any()
        .equal(Joi.ref('password'))
        .required()
        .label('Confirm password')
        .messages({ 'any.only': '{{#label}} does not match' }),
});

const resetPassword = Joi.object({
    userId: Joi.string().required(),

    password: Joi.string().pattern(passwordRegex).required().label('Password'),

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

export default { registerUser, login, resetPassword };
