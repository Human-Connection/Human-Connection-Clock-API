# Clock of Change - API Server (Backend)

This repository contains the API Server - or in other terms Backend - of the Clock of Change.

To find out more about the Clock of Change and Human Connection - the network behind it - visit https://human-connection.org/en/.

## Tech Stack

* Node.js: The API Server is running on [Node.js](https://nodejs.org/en/) - a JavaScript runtime environment for server-side scripting
* Express.js: We use the [Express.js](https://expressjs.com/en/) framework - a Node.js framework to help build web applications
* Nodemon: We use [Nodemon](https://nodemon.io/) for development - a handy replacement wrapper for Node.js that automatically restarts the application on file changes
* MySQL: We use [MySQL](https://www.mysql.com) as our relational database of choice to store our data 

the new COC API is written in nodejs on top of express. 
All routes reside in /core/restapi.js

## Project Structure & Components

**PROJECT STRUCTURE / DIRECTORIES**

* core/: The core directory contains the most important files of the project like database, mailer, router and main controller
* core/restapi.js: All routes can be found here
* mails/: The mails directory holds the mail templates
* public/: The public folder is not used for now


**DATABASE**

We use mysql for the COC API and right now we have 2 tables entries and apikeys


## Installation
...

## Usage
**AUTHENTICATION**

to authenticate simply send API-Key in each requests headers

**USAGE:**

if you have nodemon installed from dev dependencies use "npm start" 
to run the Server, the default port is 1337.

to ensure emails are working properly make sure to set your smtp credentials in 
/core/mailer.js this will use templates from /mails directory.

once the server is running you can use the following routes:

GET http://127.0.0.1/cube.php
   - return the current count of entries with email_confirmed === 1 && status === 1
   - no auth required
   - returns the number (we change to json once we can adjust hardware clocks)
GET http://127.0.0.1/entries/verify/:k
   - verify an entry with a valid link parameter :k for example http://127.0.0.1/entries/verify/sadSdjsarj3jf3j3wfmwfj3w
   - no auth required
   - returns {success : true || false, invalidKeyError if key is invalid/used}
POST http://127.0.0.1/entries
   - call with body data firstname, lastname, email, country, message, anon (int 0 or 1), image to create a new entry
   - requires auth (see **AUTHENTICATION**)
   - returns {success : true}
   - may return errors mimeError, sizeError, missingFields, fieldErrors, missingImageError
   
GET http://127.0.0.1/entries 
    - to get back all entries allowed parameters are limit (10), offset (0) and active (false)
    where active will return items which have email_confirmed === 1 AND status === 1
    - requires auth
    - returns {success : true, results : out, totalCount : results.length, page : offset}
    - return {success : false, message : "error"}
