import StatusCodes from 'http-status-codes';

export default class ValidationException extends Error {
    public status = StatusCodes.BAD_REQUEST;
    public message: string;

    constructor(message: string) {
        super(message);
        this.message = message;
    }
}
