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

# Architecture
![login page](https://github.com/Krosent/mu-iot-dashboard/blob/master/.github/images/MU-IOT-App-Architecture.png)

# UI View
![login page](https://github.com/Krosent/mu-iot-dashboard/blob/master/.github/images/Screenshot%20from%202022-08-15%2013-00-05.png)
![dashboard page your rules open](https://github.com/Krosent/mu-iot-dashboard/blob/master/.github/images/Screenshot%20from%202022-08-15%2013-00-50.png)
![dashboard page other users rules open](https://github.com/Krosent/mu-iot-dashboard/blob/master/.github/images/Screenshot%20from%202022-08-15%2013-00-55.png)
![suppression rule message](https://github.com/Krosent/mu-iot-dashboard/blob/master/.github/images/Screenshot%20from%202022-08-15%2013-00-59.png)
