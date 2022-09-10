import StatusCodes from 'http-status-codes';

export default class UnauthorizedException extends Error {
    public status = StatusCodes.UNAUTHORIZED;
    public message: string;

    constructor(message: string) {
        super(message);
        this.message = message;
    }
}
