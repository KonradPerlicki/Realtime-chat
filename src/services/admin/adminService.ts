import { FileArray, UploadedFile } from 'express-fileupload';
import { ProjectionType } from 'mongoose';
import { join } from 'path';
import UserNotFoundException from '../../exceptions/userNotFoundException';
import User, { UserInterface } from '../../models/User';
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

    public async getUserById(
        id: string,
        projection: ProjectionType<UserInterface> = {},
        throwException = false
    ) {
        try {
            const user = await User.findById(id, projection);
            if (!user) {
                throw new Error('This user does not exist');
            }
            return user;
        } catch (error: any) {
            if (throwException) {
                throw new UserNotFoundException(error.message);
            }
            return null;
        }
    }
}
