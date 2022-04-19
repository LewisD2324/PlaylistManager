import axios from 'axios';
import querystring from 'querystring';
import request from 'request';
import { Request, Response } from 'express';
import Cryptojs from 'crypto-js';
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from '../config';

export let access_token = '';
export let refresh_token = '';
export let expires_in = 0;
export let expirationTime = 0;

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = length => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  const stateKey = 'spotify_auth_state';

const code_verifier = generateRandomString(128);
const code_challenge = generateCodeChallenge(code_verifier);


function base64URL(string: any) {
    return string.toString(Cryptojs.enc.Base64).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function generateCodeChallenge(code_verifier: string) {
    return base64URL(Cryptojs.SHA256(code_verifier));
}

export default (app: any) => {
    app.get('/api/userinfo', async (req: Request, res: Response) => {
        try {
            const headers = {
                Authorization: 'Bearer ' + access_token,
            };
            const result = await axios.get('https://api.spotify.com/v1/me', {
                headers,
            });
            console.log(result.data);
            res.status(200).send(result.data);
        } catch (err) {
            res.status(400).send(err);
        }
    });

    app.get('/login', (req: Request, res: Response) => {
        const state = generateRandomString(16);
        res.cookie(stateKey, state);

        // your application requests authorization
        const scope =
            'user-read-private user-read-email playlist-modify-public playlist-read-collaborative playlist-read-private playlist-modify-private';
        res.redirect(
            'https://accounts.spotify.com/authorize?' +
                querystring.stringify({
                    response_type: 'code',
                    client_id: CLIENT_ID,
                    code_challenge_method: 'S256',
                    code_challenge: code_challenge,
                    scope: scope,
                    redirect_uri: REDIRECT_URI,
                    state: state,
                })
        );
    });

//TODO - Change to async await
    app.get('/callback', (req: Request, res: Response) => {
        // your application requests refresh and access tokens
        // after checking the state parameter
        const code = req.query.code || null;

        axios({
          method: 'post',
          url: 'https://accounts.spotify.com/api/token',
          data: querystring.stringify({
            grant_type: 'authorization_code',
            code: code as string,
            redirect_uri: REDIRECT_URI
          }),
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
          },
        })
          .then(response => {
            if (response.status === 200) {
              res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
            } else {
              res.send(response);
            }
          })
          .catch(error => {
            res.send(error);
          });


        // const code = req.query.code || null;
        // const state = req.query.state || null;
        // const storedState = req.cookies ? req.cookies[stateKey] : null;

        // if (state === null || state !== storedState) {
        //     res.redirect(
        //         'http://localhost:3000/Landing/#' +
        //             querystring.stringify({
        //                 error: 'state_mismatch',
        //             })
        //     );
        // } else {
        //     res.clearCookie(stateKey);
        //     const authOptions = {
        //         url: 'https://accounts.spotify.com/api/token',
        //         form: {
        //             client_id: CLIENT_ID,
        //             code: code,
        //             redirect_uri: redirect_uri,
        //             grant_type: 'authorization_code',
        //             code_verifier: code_verifier,
        //         },
        //         headers: {
        //             'Content-Type': 'application/x-www-form-urlencoded',
        //         },
        //         json: true,
        //     };

        //     request.post(authOptions, function (error: any, response: any, body: any) {
        //         if (!error && response.statusCode === 200) {
        //             console.log(body);
        //             access_token = body.access_token;
        //             refresh_token = body.refresh_token;
        //             expires_in = body.expires_in;

        //             expirationTime = new Date().getTime() + expires_in * 1000;

        //             //Save as cookie
        //             // res.cookie("jwt", access_token, {
        //             //   httpOnly: true,
        //             //   secure: true,
        //             //   maxAge: 3600000,
        //             // });

        //             res.redirect('http://localhost:3000/Landing/');
        //         } else {
        //             res.redirect(
        //                 '/' +
        //                     querystring.stringify({
        //                         error: 'invalid_token',
        //                     })
        //             );
        //         }
        //     });
       // }
    });
};
