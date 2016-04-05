# Tribe

Tribe is a [Sails](http://sailsjs.org) application, visit [http://sailsjs.org](http://sailsjs.org) for more info.

The application was tested with node v0.12.7 on the last commit.

To get started install sails

```
npm install sails
```

To start the application, from the Tribe directory, install the modules and run:

```
npm install
sails lift
```

## FRONT-END

A very basic front end app has been created by [zahramaslavi](https://github.com/zahramaslavi). It consists of a demo Angular project that lives in:

```
/views/
/assets/
```

* You will find the main Angular controller in `assets/js/controllers/myApp.js`. In `assets/js` you will find the dependencies, directives and services used in the app.
* Similarly, you will find the modals in `/assets/modals` and the templates in `assets/templates`

The html files that Angular uses will be in: `views/modals` and `views/partials`. Look here to modify the layout.

### Status

The current front end is a prototype that needs to be extended and refactored. As it stands, the application is a proof of concept and needs more development. Tasks you will need to do:

* Refactor `/assets/js/controllers/myApp.js`. Currently it uses a set of intervals to render the page. This is greatly inneficient and HAS to be refactored to use Angular callbacks. THIS TASK IS VERY IMPORTANT!
* There is a great work to do in the forms (`views/partials`) to use validation (e.g. `ng-disable, ng-validate` to validate names, existence of names and images)

## MongoDB setup

Install MongoDB. Create a user by running these two commands in a mongo client:

```
use tribe
db.addUser( { user: "user", pwd: "password", roles: [ "readWrite", "dbAdmin" ]} )
```

For development modify the `config/skipperconf.js` file to match your credentials

```
module.exports.skipperconf = {
    local_uri: 'mongodb://user:password@localhost:27017/tribe.bucket'
};
```

Configure your `config/env/development.js` file to match your credentials:

```
localMongodbServer: {
  adapter: 'sails-mongo',
  host: 'localhost',
  port: 27017,
  user: 'user',
  password: 'password',
  database: 'tribe'
}
```

## DEPLOYING WITH HEROKU

http://pburtchaell.com/2015/sails/

## Deploying with Apache

[This article](https://www.digitalocean.com/community/tutorials/how-to-create-an-node-js-app-using-sails-js-on-an-ubuntu-vps) is very helpful in understanding how to deploy in an ubuntu box. The instructions below are an adaptation of it.

You need to have the following modules enabled in Apache. This can generally be done (in Ubuntu) in the ``/etc/apache2/mods-enable` directory.

```
LoadModule proxy_http_module /usr/lib/apache2/modules/mod_proxy_http.so
LoadModule proxy_module /usr/lib/apache2/modules/mod_proxy.so
LoadModule proxy_html_module /usr/lib/apache2/modules/mod_proxy_html.so
LoadModule xml2enc_module /usr/lib/apache2/modules/mod_xml2enc.so
```

We will now configure a a proxy. Create the file `/etc/apache2/sites-available/001-tribe.conf` containing:

```
<VirtualHost *:80>
  ServerName  your.sub.domain.url.com

  ProxyRequests Off
  <Proxy *>
     Order deny,allow
     Allow from all
  </Proxy>
  ProxyPass / http://localhost:1337/
  ProxyPassReverse / http://localhost:1337/

</VirtualHost>
```

More information on this setup as reverse proxy can be found in [here](https://www.digitalocean.com/community/tutorials/how-to-use-apache-http-server-as-reverse-proxy-using-mod_proxy-extension)

## Deployment in Production

You will find a run.sh file you can run easily in production:

```
sh run.sh
```

Alternatively, run indefinitely using [PM2](https://github.com/Unitech/pm2). Install pm2 and run pm2. Which will start and daemonize the application. Simple.

```
npm install -g pm2
pm2 start app.js -x -- --prod
```

## Development

Start the aplication with:

```
sails lift
```

and visit

http://localhost:1337/app

#### NOTE

You will notice that when you upload a file the front end will not find it. This is because the .tmp/public folder is re-built on a schedule, even when you upload a file it will not automatically be available. There's two ways to go at it: 1) use a proper Amazon S3 storage ([following this documentation](http://sailsjs.org/documentation/concepts/file-uploads/uploading-to-s-3)), update the urls on the front end and you're done. 2) you can hack (I really don't like this option) it so that it directly saves it to .tmp/public, however you need to configure grunt not to delete your files upon reload. For more info [see this stackoverflow question](http://stackoverflow.com/questions/32333698/i-can-not-see-the-image-i-just-uploaded-sails-js).

## TRIBE API

The API is straightfoward and you can learn more about it in [Sails Blueprint documentation](http://sailsjs.org/documentation/reference/blueprint-api#?blueprint-actions). Here documented are the ones you might be interested in knowing

Currently the API is locked down so that only session authorized users can access it. If you need to use an API point publicly replace the 'sessionAuth' strategy with the strategy 'bearerAuth' in 'config/policies.js'. Read more there.

To test your public (using bearerAuth) API you can use curl, bearerAuth expects a Bearer authorization header, for example this (use your Bearer token):

```
curl -i http://localhost:1337/user -H "Authorization: Bearer sGNhj+LuygTTS0wv9tLyvICJefbRI/t7xSLYBorL7sHvQsfCUKoHlnSGcP3JRWd"
```

### Data models

The models relationships in Tribe are:

```
User -*---*-> Tribe -1---*-> Topic -1---*-> Photo
```


### USERS

At the moment users need to be created through the signup process at http://localhost:1337/register

### TRIBES

Tribes are collections of topics. Tribes have members, which can be associated with users.

#### Retrieve all tribes

* URL: http://localhost:1337/tribe
* METHOD: GET
* PARAMS: none

Example response:

```
[
  {
    "members": [
      {
        "username": "calderonroberto",
        "email": "roberto.entrepreneur@gmail.com",
        "createdAt": "2016-02-28T07:18:30.738Z",
        "updatedAt": "2016-02-28T07:18:30.738Z",
        "id": 1
      }
    ],
    "topics": [
      {
        "description": "A first topic",
        "createdAt": "2016-02-28T07:19:59.999Z",
        "updatedAt": "2016-02-28T07:20:00.003Z",
        "id": 1
      },
      {
        "description": "A second Topic",
        "createdAt": "2016-02-28T07:20:05.829Z",
        "updatedAt": "2016-02-28T07:20:05.833Z",
        "id": 2
      },
      {
        "description": "Yet another topic",
        "createdAt": "2016-02-28T07:20:14.351Z",
        "updatedAt": "2016-02-28T07:20:14.354Z",
        "id": 3
      }
    ],
    "image_url": "08d56393-2017-4177-a687-2dd928a9a91f.jpg",
    "description": "The first Tribe",
    "name": "Tribe One",
    "createdAt": "2016-02-28T07:19:00.512Z",
    "updatedAt": "2016-02-28T07:19:00.520Z",
    "id": 1
  },
  {
    "members": [
      {
        "username": "calderonroberto",
        "email": "roberto.entrepreneur@gmail.com",
        "createdAt": "2016-02-28T07:18:30.738Z",
        "updatedAt": "2016-02-28T07:18:30.738Z",
        "id": 1
      }
    ],
    "topics": [],
    "image_url": "2ad35316-b98b-494d-931d-78ca47cbdd98.jpg",
    "description": "Another Tribe",
    "name": "Second Tribe",
    "createdAt": "2016-02-28T07:19:29.377Z",
    "updatedAt": "2016-02-28T07:19:29.382Z",
    "id": 2
  },
  {
    "members": [
      {
        "username": "calderonroberto",
        "email": "roberto.entrepreneur@gmail.com",
        "createdAt": "2016-02-28T07:18:30.738Z",
        "updatedAt": "2016-02-28T07:18:30.738Z",
        "id": 1
      }
    ],
    "topics": [],
    "image_url": "3399f159-d05e-4828-b403-d1b3272f9109.jpg",
    "description": "Yet Another Tribe",
    "name": "A Third Tribe",
    "createdAt": "2016-02-28T07:19:51.787Z",
    "updatedAt": "2016-02-28T07:19:51.791Z",
    "id": 3
  }
]
```
#### Retrieve one tribe

* URL: http://localhost:1337/tribe/:id
* METHOD: GET
* PARAMS: none

Example response:

```
{
  "members": [
    {
      "username": "calderonroberto",
      "email": "roberto.entrepreneur@gmail.com",
      "createdAt": "2016-02-28T07:18:30.738Z",
      "updatedAt": "2016-02-28T07:18:30.738Z",
      "id": 1
    }
  ],
  "topics": [
    {
      "description": "A first topic",
      "createdAt": "2016-02-28T07:19:59.999Z",
      "updatedAt": "2016-02-28T07:20:00.003Z",
      "id": 1
    },
    {
      "description": "A second Topic",
      "createdAt": "2016-02-28T07:20:05.829Z",
      "updatedAt": "2016-02-28T07:20:05.833Z",
      "id": 2
    },
    {
      "description": "Yet another topic",
      "createdAt": "2016-02-28T07:20:14.351Z",
      "updatedAt": "2016-02-28T07:20:14.354Z",
      "id": 3
    }
  ],
  "image_url": "08d56393-2017-4177-a687-2dd928a9a91f.jpg",
  "description": "The first Tribe",
  "name": "Tribe One",
  "createdAt": "2016-02-28T07:19:00.512Z",
  "updatedAt": "2016-02-28T07:19:00.520Z",
  "id": 1
}
```

#### Create a tribe

* URL: http://localhost:1337/tribe
* METHOD: POST
* PARAMS: name (string), description (string), members(int id of user member)

Example JSON payload:

```
{"name":"Founders", "description": "The first tribe"}
```

Note that this will not upload an image. you can use http://localhost:1337/tribe/upload to upload an image with that tribe. Add the parameter 'photo'. A testing form is available at http://localhost:1337/tribe/new

#### Join a Tribe

* URL: http://localhost:1337/tribe/:id/join
* METHOD: POST
* PARAMS: none

This API endpoint will add the authenticated user to the list of members of such tribe. It will return the updated Tribe. Example Response:

```

{
  "members": [
    {
      "username": "calderonroberto",
      "email": "roberto.entrepreneur@gmail.com",
      "createdAt": "2016-02-28T07:18:30.738Z",
      "updatedAt": "2016-02-28T07:18:30.738Z",
      "id": 1
    },
    {
      "username": "pancho",
      "email": "pancho@gmail.com",
      "createdAt": "2016-02-28T08:10:48.358Z",
      "updatedAt": "2016-02-28T08:10:48.358Z",
      "id": 2
    }
  ],
  "topics": [
    {
      "description": "A first topic",
      "createdAt": "2016-02-28T07:19:59.999Z",
      "updatedAt": "2016-02-28T07:20:00.003Z",
      "id": 1
    },
    {
      "description": "A second Topic",
      "createdAt": "2016-02-28T07:20:05.829Z",
      "updatedAt": "2016-02-28T07:20:05.833Z",
      "id": 2
    },
    {
      "description": "Yet another topic",
      "createdAt": "2016-02-28T07:20:14.351Z",
      "updatedAt": "2016-02-28T07:20:14.354Z",
      "id": 3
    }
  ],
  "image_url": "08d56393-2017-4177-a687-2dd928a9a91f.jpg",
  "description": "The first Tribe",
  "name": "Tribe One",
  "createdAt": "2016-02-28T07:19:00.512Z",
  "updatedAt": "2016-02-28T08:18:09.254Z",
  "id": 1
}
```

#### Update a tribe

* URL: http://localhost:1337/tribe/:id
* METHOD: PUT
* PARAMS: name (string), description (string), image_url (string)

Example JSON payload:

```
{"name":"Founders", "description": "Modified tribe"}
```

#### Delete a tribe

* URL: http://localhost:1337/tribe/:id
* METHOD: DELETE
* PARAMS: none

### TOPICS

Topics are string "questions" or "goals" that belong to one or many tribes and have photos associated with them.

#### Retrieve all topics

* URL: http://localhost:1337/topic
* METHOD: GET
* PARAMS: none


#### Retrieve one topic

* URL: http://localhost:1337/topic/:id
* METHOD: GET
* PARAMS: none

Example Response:

```
{
  "photos": [
    {
      "image_url": "debd1c33-1873-4d39-b3cf-c76376ed14a6.jpg",
      "description": "First Photo",
      "votes": 1,
      "owner": 1,
      "topic": 3,
      "createdAt": "2016-02-28T07:20:27.856Z",
      "updatedAt": "2016-02-28T07:22:08.737Z",
      "id": 1
    },
    {
      "image_url": "5a022567-001b-471c-ba99-ce279a39092f.svg",
      "description": "Second Photo",
      "votes": 0,
      "owner": 1,
      "topic": 3,
      "createdAt": "2016-02-28T07:21:33.017Z",
      "updatedAt": "2016-02-28T07:21:33.017Z",
      "id": 2
    },
    {
      "image_url": "e3e03041-a312-49f6-9a27-538105b69f74.jpg",
      "description": "A Tacoma",
      "votes": 0,
      "owner": 1,
      "topic": 3,
      "createdAt": "2016-02-28T07:22:03.183Z",
      "updatedAt": "2016-02-28T07:22:03.183Z",
      "id": 3
    }
  ],
  "tribes": [
    {
      "image_url": "08d56393-2017-4177-a687-2dd928a9a91f.jpg",
      "description": "The first Tribe",
      "name": "Tribe One",
      "createdAt": "2016-02-28T07:19:00.512Z",
      "updatedAt": "2016-02-28T07:19:00.520Z",
      "id": 1
    }
  ],
  "description": "Yet another topic",
  "createdAt": "2016-02-28T07:20:14.351Z",
  "updatedAt": "2016-02-28T07:20:14.354Z",
  "id": 3
}
```

#### Create a topic

* URL: http://localhost:1337/topic
* METHOD: POST
* PARAMS: description (string), tribes (int id of tribe it belongs to)

Example JSON payload:

```
{"description": "Best time of the year", "tribes":7}
```

#### Update a topic

* URL: http://localhost:1337/topic/:id
* METHOD: PUT
* PARAMS: description (string)

Example JSON payload:

```
{"description": "Modified topic"}
```

#### Delete a topic

* URL:http://localhost:1337/topic/:id
* METHOD: DELETE
* PARAMS: none

### PHOTOS

Photos are, what they say they are, photos. They have a description, votes. Each photo has an owner, associated with a user, and a topic they belong to.

#### Retrieve all photos

* URL: http://localhost:1337/photo
* METHOD: GET
* PARAMS: none

#### Retrieve one photo

* URL: http://localhost:1337/photo/:id
* METHOD: GET
* PARAMS: none

#### Create a photo

* URL: http://localhost:1337/photo
* METHOD: POST
* PARAMS: description (string), topic (int id of topic it belongs to), owner (int id of user), image_url (string)

Example JSON payload:

```
{"description": "My best friend", "topic":7}
```

Note that this will not upload an image. you can use http://localhost:1337/photo/upload to upload an image and create a new record. Add the parameter 'photo'. A testing form is available at http://localhost:1337/photo/new


#### Update a photo

* URLhttp://localhost:1337/photo/:id
* METHOD: PUT
* PARAMS: description (string)

Example JSON payload:

```
{"description": "Modified description"}
```

#### Delete a photo

* URL: http://localhost:1337/photo/:id
* METHOD: DELETE
* PARAMS: none

#### Upvote a photo

A custom controller method exists to do this.

* URL: http://localhost:1337/photo/:id/upvote
* METHOD: POST
* PARAMS: none

No parameters are needed and users can upvote as many as they want, for now, like cookie clicker.
