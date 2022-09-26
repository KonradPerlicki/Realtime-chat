import { FileArray, UploadedFile } from 'express-fileupload';
import { join } from 'path';
import MainService from '../mainService';

interface UploadedFiles {
    [key: string]: string;
}

export default class AdminService extends MainService {
    public async uploadFiles(
        files: FileArray | null | undefined,
        names: string[]
    ) {
        if (!files) return {};

        const data: UploadedFiles = {};
        names.forEach(async (name) => {
            const file = files[name] as UploadedFile;
            if (!file) return;
            const fileName = new Date().getTime() + '_' + file.name;
            file.mv(
                join(
                    __dirname,
                    '..',
                    '..',
                    '..',
                    'public',
                    'assets',
                    'images',
                    'users',
                    fileName
                ),
                (err) => {
                    if (err) return;
                }
            );
            data[name] = fileName;
        });
        return data;
    }
}
