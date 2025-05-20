import {
  Controller,
  All,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { lastValueFrom } from 'rxjs';

import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard }   from 'src/auth/roles/roles.guard';

@Controller()
export class ProxyController {
  constructor(private readonly httpService: HttpService) {}

  @All('/auth/*')
  async proxyToAuth(@Req() req: Request, @Res() res: Response) {
    const headers = { ...req.headers } as Record<string,string>;
    delete headers['content-length'];
    delete headers['host'];

    const url = `http://auth:3001${req.originalUrl}`;
    try {
      const result = await lastValueFrom(
        this.httpService.request({ method: req.method, url, data: req.body, headers }),
      );
      return res.status(result.status).json(result.data);
    } catch (err: any) {
      const status = err.response?.status || 500;
      const data   = err.response?.data   || { message: err.message };
      return res.status(status).json(data);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @All('/event/*')
  async proxyToEvent(@Req() req: Request, @Res() res: Response) {
    const headers = { ...req.headers } as Record<string,string>;
    delete headers['content-length'];
    delete headers['host'];

    const path = req.originalUrl.replace(/^\/event/, '');
    const url  = `http://event:3002${path}`;
    try {
      const result = await lastValueFrom(
        this.httpService.request({ method: req.method, url, data: req.body, headers }),
      );
      return res.status(result.status).json(result.data);
    } catch (err: any) {
      const status = err.response?.status || 500;
      const data   = err.response?.data   || { message: err.message };
      return res.status(status).json(data);
    }
  }
}
