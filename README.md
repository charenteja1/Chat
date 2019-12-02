# websocket-chat


This repo contains simple implementation of chat application powered by spring websockets on server and frontend implemented with Angular.

## Getting up and running

It will require two terminals to separatly run server and frontend:

```
$ cd websocket-chat
$ cd server
$ mvn spring-boot:run
```
This will make the server to run on `http://localhost:8080`.

Open another terminal and navigate to the repo:

```
$ cd client
$ npm install
$ ng serve
```
This will make the frontend to run on `http://localhost:4200`.