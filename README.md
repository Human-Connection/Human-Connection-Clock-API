**COC API Server**

the new COC API is written in nodejs on top of express. 
All routes reside in /core/restapi.js

**AUTHENTICATION**

to authenticate simply send API-Key in each requests headers

**USAGE:**

if you have nodemon installed from dev dependencies use "npm start" 
to run the Server, the default port is 1337.

to ensure emails are working properly make sure to set your smtp credentials in 
/core/mailer.js this will use templates from /mails directory.

*DATABASE*

we use mysql for the coc api right now we have 2 tables entries and apikeys

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