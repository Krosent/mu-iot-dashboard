# Multi User IoT Dashboard (mu-iot-dashboard)
- This project is a part of thesis at Vrije Universiteit Brussel
- Stack: Javascript, Node.js, Express.js, Solid Project, MongoDB, Mongoose, Bootstrap 5, Vis.js

# Installation Guide
* First of all you need to install a local instance of MongoDB (https://www.mongodb.com/docs/manual/installation/)
* After MongoDB is installed you need to update `app.js` file `(:49)` where `mongoose.connect` function is located with your own credentials
* The second step is to have NPM (https://www.npmjs.com/) on your machine
* In the root folder of the project you need to execute command `npm install`
* You are ready to run our application, you need to execute following NPM command: `npm start`
* Give a system 30 seconds to download first automation rules and after that you can go into dashboard through `localhost:8888`