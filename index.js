// Required imports
const express = require('express'); // Express web server framework
const cors = require('cors');
const cookieParser = require('cookie-parser');
const request = require('request'); // "Request" library
const path = require('path');
const querystring = require('querystring');
const cool = require('cool-ascii-faces');
const pg = require('pg');

// Constants
const port = process.env.PORT || 5000;
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI || `http://localhost:${port}/callback`;
const stateKey = 'spotify_auth_state';


// Initialize the app
const app = express();

// Setup the app
app.set('port', port);

// Setup the middleware

let whitelist = [
  'https://ipsyfy.herokuapp.com',
  'http://ipsyfy.herokuapp.com',
];

if (process.env.NODE_ENV !== 'production') {
  whitelist = whitelist.concat([
    'http://localhost:3000',
    'http://localhost:3001',
  ]);
}

const corsOptions = {
  origin(origin, callback) {
    // origin is undefined for non-cross-origin requests
    // See here for reference: http://stackoverflow.com/a/15988671/1860704
    const isLocalRequest = (origin === undefined);
    const isChromeExtension = !isLocalRequest && origin.indexOf('chrome-extension://') !== -1;
    const isCorsOk = whitelist.indexOf(origin) !== -1;
    const originIsWhitelisted = isLocalRequest || isCorsOk || isChromeExtension;
    if (!originIsWhitelisted) {
      logger.error(`The request is not whitelisted: ${origin}`);
    }
    callback(originIsWhitelisted ? null : 'Bad Request', originIsWhitelisted);
  },
};

app.use(express.static(__dirname + '/public'))
   .use(cookieParser())
   .use(cors(corsOptions));

// Set the directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};


// URLs config
app.get('/', function(request, response) {
  response.render('pages/index', { ascii_face: cool() })
});


app.get('/login', function(req, res) {

  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  const scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});


app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        const access_token = body.access_token;
        const refresh_token = body.refresh_token;

        const options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
            pg.connect(process.env.DATABASE_URL, function(err, client, done) {
              client.query(
                'INSERT into spotify_access (access_token, refresh_token) VALUES($1, $2)',
                [access_token, refresh_token], function(err, result) {
                done();
                if (err)
                 { console.error(err); res.send("Error " + err); }
                else {
                  console.log('Done saving tokens to db');
                  res.render(
                    'pages/logged_in',
                    { access_token, refresh_token, data: body }
                  );

                }
              });
            });
        });

      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});


app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  const refresh_token = req.query.refresh_token;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      res.send({ access_token });
    }
  });
});

app.get('/cool', (request, response) => response.send(cool()));


// Endpoint to serve the ReactJS frontend
app.get('/search', (request, response) => {
  response.sendFile(path.resolve('public', 'fe', 'index.html'));
});


app.get('/get-tokens', (request, response) => {
  const q = `
    SELECT access_token, refresh_token
    FROM spotify_access
    ORDER BY created_at DESC LIMIT 1
  `;

  pg.connect(process.env.DATABASE_URL, (err, client, done) => {
    client.query(q, (err, result) => {
      done();
      if (err) {
        console.error(err);
        response.send("Error: " + err);
      } else {
        const data = JSON.stringify(result.rows[0]);
        console.log('db query result: ', data);

        response.setHeader('Content-Type', 'application/json');
        response.send(data);
      }
    });
  });
});


// Start the app
app.listen(port, () => {
  console.log('Node app is running on port', port);
});
