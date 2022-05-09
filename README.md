About the project:<br>
This is a small service thats tracks user stats for courses they study <br><br>
It is build in nodejs and using npm as the package manager and mongodb as the database<br>
Packages used are:<br>
express: for API management<br>
dotenv: to manage enviroment variables<br>
supertest, mocha, chai, mockgoose: for testing<br>
nodemon: for help with development e.g. automatic web server restarts after file changes<br>
mongoose: to manage mongodb

Getting started:<br>
Please first install all dependences with `npm install`.<br>

Create .env file in root directory that contains:
MONGO_URI: your mongo uri
PORT: port for server to listen to  
NODE_ENV: for the node enviroment (dev, test, prod)

Web server:<br>
To run the web server in production use `npm start`<br>
To run the web server for development`npm run dev`<br>
To run tests use `npm test`

Assumptions:<br>
User authentication is handled elsewhere and user is always authenticated. <br>
Course and user creation wouuld be expanded for a real system <br>
A User can have multiple sessions for the same course <br>
Multiple sessions can exist with the same userId and courseId <br>
If sessionId is passed to /courses/{courseId} then its to update the session, otherwise its to create a new session <br>
Response variables defined in swagger file are also required. <br>
