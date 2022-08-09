/*
Author: Artyom Kuznetsov
This project is a part of Thesis Work on topic:
- TOWARDS INTELLIGIBILITY IN MULTI-USER IOT ENVIRONMENTS

Promotor: prof. dr. Beat Signer
Supervisor: Ekene Attoh
*/

const app = require('./app');

const port = '8888';

app.listen(port, () => {
  console.log('\n');
  console.log('--------------------------------------------------');
  console.log('Welcome to MU-IoT Dashboard!');
  console.log(`Server is listening on port ${port}...`);
  console.log('--------------------------------------------------');
  console.log('\n');
});
