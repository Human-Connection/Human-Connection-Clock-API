# Clock of Change - API Server (Backend)


This repository contains the API Server - or in other terms Backend - of the Clock of Change.

To find out more about the Clock of Change and Human Connection - the network behind it - visit https://human-connection.org/en/.

## Tech Stack

* Node.js: The API Server is running on [Node.js](https://nodejs.org/en/) - a JavaScript runtime environment for server-side scripting
* Express.js: We use the [Express.js](https://expressjs.com/en/) framework - a Node.js framework to help build web applications
* Nodemon: We use [Nodemon](https://nodemon.io/) for development - a handy replacement wrapper for Node.js that automatically restarts the application on file changes
* MySQL: We use [MySQL](https://www.mysql.com) as our relational database of choice to store our data 


## Project Structure & Components

**PROJECT STRUCTURE / DIRECTORIES**

* server.js: The starting point for this Node.js application which starts the server
* core/: The core directory contains the most important files of the project like database, mailer, router and main controller
* core/entryController.js: Is the main controller for all the requests
* core/restapi.js: All routes can be found here, they will also be listed further down
* mails/: The mails directory holds the mail templates
* public/: The public directory is not used for now


**DATABASE**

We use MySQL for the COC API as our relational database. 
Currently all of the database related code can be found in the `core/db.js` file.
This includes the credentials for the database (host, user, password and db name) and can be changed in this file.

TODO: Add description of tables

**MAILER**

The code related to the mail system can be found in the file `core/mailer.js`.
For the mailer to work the smtp credentials need to be changed in this file as well.
Then the mailer will work and use the mail templates from `mails/entry/`


## Installation

**PREREQUESITES**

Before starting the installation you need to make sure you have the following tools installed:
* Git: You need to have Git installed. You can check this in the console with `git --help`. For installation instructions visit https://git-scm.com/
* Node.js: You need to have Node.js installed. You can check this in the console with `node -v`. For installation instructions visit https://nodejs.org/en/
* Npm: You need to have npm installed. You can check this in the console with `npm -v`. For installation instructions head to https://www.npmjs.com/get-npm

**INSTALLATION**

1. First you need to clone the git repository of the Clock of Change API. Head to a directory where you want the git repository to reside
and open the directory in the console. Then run `git clone https://github.com/Human-Connection/Clock-of-Change-API.git` to clone the repository to this directory.
2. Go to the newly created Clock-of-Change-API directory (`cd Clock-of-Change-API` in the console) and run `npm install`.
Now all the dependencies should install.
3. Edit the file `core/db.js` and add your MySQL credentials (host, user, password, database name). 
4. Create the tables - TODO: Add create table script & insert start values
5. Edit the file `core/mailer.js` and add your smtp credentials (host, user, password)

Now the Clock of Change API server is ready to tick.

## Usage

**START THE SERVER**

In the base Clock-of-Change-API directory run

`npm run start`

in the console to start the Clock of Change API server.
This will start Nodemon and the Node.js server, which will start listening for and processing requests at [http://localhost:1337](http://localhost:1337).

**MAKE REQUESTS**

Pro Tip: Get [Postman](https://www.getpostman.com/) to make requests. This amazing tool makes working with APIs way easier.

When using the default port 1337 (which you do if you haven't changed it in server.js), you can send requests to the Clock of Change API to `http://127.0.0.1:1337`.

Refer to the list of routes below, to see all possible requests with description you can make.

**ROUTES**

List of routes / endpoints

| Method | URI | Description |
|---|---|---|
| GET | http://127.0.0.1/cube.php | - Temp Route until path can be changed<br/>- Returns the current number of confirmed entries<br/>- No authentication required<br/>- Returns a number/string (we change to json once we can adjust hardware clocks)  |
| GET | http://127.0.0.1/entries/verify/:k | - Verify an entry with a email validation link/hash :k (for example http://127.0.0.1/entries/verify/sadSdjsarj3jf3j3wfmwfj3w)<br/>- Returns Json {success : true || false, invalidKeyError if hash is invalid/used} |
| POST | http://127.0.0.1/entries | - Requires auth (see AUTHENTICATION)<br/>- Create a new entry from body parameters<br/>- Body parameters: firstname, lastname, email, country, message, anon (int 0 or 1), image<br/>- Returns Json {success : true}<br/>- May return errors mimeError, sizeError, missingFields, fieldErrors, missingImageError |
| GET | http://127.0.0.1/entries  | - Requires auth<br/>- Get back all entries<br/>- Parameters: limit (default 10), offset (default 0) and active (default false)<br/>- If active is true,  only confirmed and active accounts will be returned<br/>- Returns Json {success : true, results : out, totalCount : results.length, page : offset} or<br/> - Return {success : false, message : "error"}|

**AUTHENTICATION**

To authenticate simply send parameter "API-Key" and the API key as the value with each request in the header

<br/>
<br/>

```
       _____
    _.'_____`._
  .'.-'  12 `-.`.
 /,' 11      1 `.\
// 10           2 \\
;;                 ::
|| 9  ---O-----  3 ||
::                 ;;
\ 8            4  //
 \`. 7       5 ,'/
 '.`-. __6__ .-'.'
   ((-._____.-))
   _))       ((_
  '--'  COC  '--'
```
