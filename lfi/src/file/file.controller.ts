import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('file')
export class FileController {
  @Get('read')
  readFile(@Query('file') filePath: string, @Res() res: Response) {
    if (!filePath) {
      return res.send('<p>essaye d afficher le fichier flag.txt dans le dossier secret :)</p>');
    }

    const fullPath = path.join(__dirname, filePath);
    console.log(fullPath)
    fs.readFile(fullPath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).send('Error reading file');
      }
      res.send(data);
    });
  }
}
