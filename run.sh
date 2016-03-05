#!/bin/bash

# To start manually
NODE_ENV=production node app.js

# Using pm2
#pm2 start app.js -x -- --prod
