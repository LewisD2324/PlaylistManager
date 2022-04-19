
import axios from 'axios';
import querystring from 'querystring';
import { NextFunction, Request, Response, response } from 'express';
import { CLIENT_ID, CLIENT_SECRET } from '../config';

//TODO - Change to async await
export default function (req: Request, res: Response, next: NextFunction) {
    const { refresh_token } = req.query;

    axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: refresh_token as string
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      },
    })
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        res.send(error);
      });
    
    next();
}