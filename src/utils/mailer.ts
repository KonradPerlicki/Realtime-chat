import nodemailer from 'nodemailer';
import { renderFile } from 'ejs';
import { join } from 'path';

export default class Mailer {
    private transporter: nodemailer.Transporter;
    private author = 'Konrad Perlicki <konrad.perlicki01@gmail.com';

    constructor() {
        const port = Number(process.env.mail_port);
        const host = <string>process.env.mail_host;
        const user = <string>process.env.mail_user;
        const password = <string>process.env.mail_password;
        this.transporter = nodemailer.createTransport({
            host: host,
            port: port,
            auth: {
                user: user,
                pass: password,
            },
        });
    }

    static async send(
        to: string,
        subject: string,
        template: string,
        data?: object
    ): Promise<void | never> {
        const mailer = new this();
        try {
            const html = await renderFile(
                join(
                    __dirname,
                    '..',
                    '..',
                    'public',
                    'views',
                    'mail',
                    template + '.ejs'
                ),
                data
            );
            const info = await mailer.transporter.sendMail({
                from: mailer.author,
                to: to,
                subject: subject,
                html: html,
            });
        } catch (error) {
            throw Error('Something went wrong, could not send email');
        }
    }
}
