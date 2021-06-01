# Jamboard

 Digital interactive whiteboard to use with your friend/colleagues. It permits to draw whatever you want and others will be able to see it, erase it and draw over.
 
 ## Getting started 
 
 ### Dependencies
 - node v14.16.0 or higher
 - npm v6.14.11 or higher
 
 ### Installing and running the program
 1. clone the repo
 2. open the folder on the local machine with CLI
 3. now, run your web server using `node app.js`
 4. in the console you should get the message "Il server è attivo sulla porta X"
 5. Visit http://localhost:X and you will see the program running
 
 ## Technologies
 - HTML
 - CSS
 - Bootstrap
 - JavaScript
 - JQuery
 - Node.JS
 - Express.js
 - Socket.io

## Implementation

#### Frontend 
is made with HTML, the main element - "Jamboard" - is implemented with an HTML Canvas

#### Backend 
For the backend is used Node.JS and Express.js, to handle the user requests we used socket.io.

### Main feature - Drawing
To avoid the need to redraw the entire line every time is registered a new position, we decided to handle the user drawing like a series of points. It permites to make to lighter to bothe the server- and clientside.

### Possible future implementations
- login
- workspaces
- images
- text

### Authors
[MikeC0xlong](https://github.com/MikeC0xl0ng)

### Acknowledgments
- [socket.io](http://socket.io/)
- [Express.js](https://expressjs.com/it/starter/hello-world.html)
- [Serving the public folder in express.js](https://expressjs.com/it/starter/static-files.html)
