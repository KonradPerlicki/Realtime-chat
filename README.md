# Express.js & TypeScript Chat application

## Live demo
Link: https://ts-chat-application.herokuapp.com/admin/login  
Demo account: 
- login: `test`
- password: `Testtest12`

<div align="center">
<h1>Tech Stack</h1>

<a href="https://www.typescriptlang.org/" title="Typescript"><img src="https://github.com/get-icon/geticon/raw/master/icons/typescript-icon.svg" alt="Typescript" width="40px" height="40px"></a>
<a href="https://expressjs.com/" title="Express"><img src="https://github.com/get-icon/geticon/raw/master/icons/express.svg" alt="Express" width="40px" height="40px"></a>
<a href="https://www.mongodb.org/" title="MongoDB"><img src="https://github.com/get-icon/geticon/raw/master/icons/mongodb-icon.svg" alt="MongoDB" width="40px" height="40px"></a>
<a href="https://nodejs.org/" title="Node.js"><img src="https://github.com/get-icon/geticon/raw/master/icons/nodejs-icon.svg" alt="Node.js" width="40px" height="40px"></a>
<a href="https://jquery.com/" title="jQuery"><img src="https://github.com/get-icon/geticon/raw/master/icons/jquery-icon.svg" alt="jQuery" width="40px" height="40px"></a>
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" title="JavaScript"><img src="https://github.com/get-icon/geticon/raw/master/icons/javascript.svg" alt="JavaScript" width="40px" height="40px"></a>
<a href="https://www.npmjs.com/" title="NPM"><img src="https://github.com/get-icon/geticon/raw/master/icons/npm.svg" alt="NPM" width="40px" height="40px"></a>
</div>

## Pre-requisites
- Installed [Node.js](https://nodejs.org/en/) version 16.8.0 LTS
- MongoDB 

## Getting started
- Clone the repository
```
git clone https://github.com/KonradPerlicki/Typescript-Project.git
```
- Install dependencies
```
cd Typescript-Project
npm install
```
- Create .env file and set `dbUri` key with connection string to your mongoDB
```
cp .\.env.example .env
```
- Build and run the project
```
npm start
```

# About this project
The main purpose of this repository is to show my skills in writing express.js applications based on TypeScript in object oriented way. Generally, It is my first project in NodeJS.  
I created chat application with real-time delivering/sending messages to users. Authentication relies on the [Json Web Token](https://jwt.io/)
and includes features such as: 
- forgot password feature (uses nodemailer - requires setting `mail_*` values in .env)
- reset password (uses nodemailer)
- login with google OAuth2.0 (requires `google_client_id` and `google_client_secret` in .env to your application)  

The app has a simple UI with possibility to look up for other users, display their profiles, send a message to them and edit own profile.  
I used [Socket.IO](https://socket.io/) to provide real-time messaging system. As a template engine, I decided to use Ejs.


## Project Structure
The folder structure of this app is explained below:

| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **dist**                 | Contains the distributable (or output) from your TypeScript build.  |
| **node_modules**         | Contains all  npm dependencies                                                            |
| **src**                  | Contains  source code that will be compiled to the dist dir                               |
| **src/controllers**      | Controllers define functions to serve various express routes. 
| **src/utils**              | Contains all the utilities and helpers needed for the application 
| **src/middleware**      | Custom express middlewares which process the incoming requests before handling them down to the routes                    
| **src/models**           | Models define schemas that will be used in storing and retrieving data from Application database  |
| **src/exceptions**      | Custom exceptions |
| **src/services**    | Services include all the business logic from controllers |
| **src/app.ts**         | Entry point to express app                                                               |
| package.json             | Contains npm dependencies as well as [build scripts]   
| tsconfig.json            | Config settings for compiling source code only written in TypeScript    
| .eslintrc.js              | Config settings for ESLint code style checking                                                |
| **.env**        | Application configuration including environment-specific configs 


### Running the build
All the different build steps are orchestrated via [npm scripts](https://docs.npmjs.com/misc/scripts).
Npm scripts basically allow us to call (and chain) terminal commands via npm.

| Npm Script | Description |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| `start`                   | Runs full build and runs node on dist/index.js. Can be invoked with `npm start`                  |
| `build`                   | Full build. Can be invoked with `npm run build`     |
| `dev`                   | Runs full build with all watch tasks. Can be invoked with `npm run dev`                                         |
