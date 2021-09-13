# Polyevents Server

![JavaScript](https://img.shields.io/badge/-JavaScript-f7df1e?style=flat-square&logo=javascript&logoColor=black)
![Nodejs](https://img.shields.io/badge/-Nodejs-339933?style=flat-square&logo=Node.js&logoColor=white)
![AWS](https://img.shields.io/badge/-AWS-232f3e?style=flat-square&logo=amazonaws&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169e1?style=flat-square&logo=PostgreSQL&logoColor=white)

### Table of Contents  
- [Introduction](https://github.com/Polyevents/Server#introduction)
- [Installation](https://github.com/Polyevents/Server#installation)

## Introduction
So, you want to use your 6th sense to make some cash real fast? Great! You are in the right place. Just follow these steps and you'll be all set! 

**You can Check the landing page <a href='https://polyevents.in'>here</a>**

<img src='https://github.com/Polyevents/App/blob/main/Screenshot%20from%202021-09-13%2009-26-34.png?raw=true' width="300" height="900"/>

## Installation
- Clone the git repository using the below code snippet:
```javascript
git clone https://github.com/Polyevents/server
```
- Change your current working directory to the project folder:
```javascript
cd server
```
- In the root of the project, make a new file **_.env_** to store the environment variables:
```javascript
touch .env
vi .env

PORT= 8080
DB_HOST= Your db host
DB_USERNAME= Your db username
DB_PASSWORD= Your Db Password
JWT_SECRET= Any random string
NEWS_API_KEY= Get it from https://newsapi.org/
```

- Install the required dependencies and start the server in dev mode:
```javascript
npm i && npm run dev
```
**Note:**
You must have **_NodeJs_, _npm_, _mongodb_, _postgreSQL_** installed in your system in order to run the project properly


### Contributions are Welcome :heart:
