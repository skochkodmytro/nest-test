import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { google } from 'googleapis';
import * as multer from 'multer';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const auth = new google.auth.GoogleAuth({
  // keyFile: 'src/credentials/google-service-account.json',
  credentials: {
    type: process.env.GOOGLE_SERVICE_TYPE,
    client_email: process.env.GOOGLE_SERVICE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SERVICE_PRIVATE_KEY,
    private_key_id: process.env.GOOGLE_SERVICE_PRIVATE_KEY_ID,
    project_id: process.env.GOOGLE_SERVICE_PROJECT_ID,
    client_id: process.env.GOOGLE_SERVICE_CLIENT_ID,
    // client_secret: process.env.GOOGLE_SERVICE_CLIENT_ID,
    // refresh_token?: string;
    // quota_project_id?: string;
    universe_domain: process.env.GOOGLE_SERVICE_UNIVERSE_DOMAIN,
  },
  scopes: SCOPES,
});
const MAIN_FOLDER_ID = '1ulHkXrQ1jV9AqugSIN4KlSORzeBuLxIo';

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'files', maxCount: 20 },
        { name: 'audio', maxCount: 1 },
      ],
      {
        storage: multer.memoryStorage(),
        limits: { fileSize: 20 * 1024 * 1024 },
      },
    ),
  )
  async uploadFile(
    @UploadedFiles()
    files: {
      files: Express.Multer.File[];
      audio?: Express.Multer.File;
    },
  ) {
    const drive = google.drive({ version: 'v3', auth });

    const folderRes = await drive.files.create({
      requestBody: {
        name: uuidv4(),
        mimeType: 'application/vnd.google-apps.folder',
        parents: [MAIN_FOLDER_ID],
      },
      fields: 'id',
      supportsAllDrives: true,
    });

    const folderId = folderRes.data.id as string;

    const uploadedFiles = await Promise.all(
      files.files.map((file, index) =>
        drive.files
          .create({
            requestBody: {
              name: `img${index + 1}.jpg`,
              parents: [folderId],
            },
            media: {
              mimeType: file.mimetype,
              body: Readable.from(file.buffer),
            },
            fields: 'id, webViewLink',
            supportsAllDrives: true,
          })
          .then((res) => res.data),
      ),
    );

    const audio = files?.audio?.[0];

    if (audio) {
      const audioRes = await drive.files.create({
        requestBody: {
          name: 'voice-message.mp3',
          parents: [folderId],
        },
        media: {
          mimeType: audio.mimetype,
          body: Readable.from(audio.buffer),
        },
        fields: 'id, webViewLink',
        supportsAllDrives: true,
      });

      uploadedFiles.push(audioRes.data);
    }

    return {
      message: 'Files uploaded to Google Drive!',
      uploadedFiles,
    };
  }
}
