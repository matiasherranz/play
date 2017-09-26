# Full Stack JS Spotify Playground

This app consists of a simple Node.js app using [Express 4](http://expressjs.com/) and
a ReactJS / Redux frontend that uses Spotify API to perform searches.

The authentication towards Spotify is done via oAuth

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku CLI](https://cli.heroku.com/) installed.

```sh
$ git clone git@github.com:matiasherranz/play.git # or clone your own fork
$ cd play
$ npm install
$ npm run build_client
$ npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku

```
$ heroku create
$ git push heroku master
$ heroku open
```
or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## Watch it live!

I set up a live instance of this app on Heroku on [https://ipsyfy.herokuapp.com/](https://ipsyfy.herokuapp.com/).
