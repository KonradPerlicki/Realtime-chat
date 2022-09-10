import StatusCodes from 'http-status-codes';

export default class UserNotFoundException extends Error {
    public status = StatusCodes.BAD_REQUEST;
    public message: string;

    constructor(message: string) {
        super(message);
        this.message = message;
    }
}
