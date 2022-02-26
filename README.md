# my-deno-api-sandbox

This is just a dummy CRUD API to test out Deno

## Dependencies

You need Deno 1.14.0 (release, x86_64-apple-darwin) installed in your system.

## How to run the API server

Execute in the project folder

```
bin/run
```

```
OPTIONS
 -d        Run it in development mode. It runs a watcher and doesn't check 
           typings for faster reloading.
 -u        Update locked dependencies before running the server.
 -l        Run linter before running the server.
 -r        Reload all cached dependencies before running server.
```

## How to run tests

Execute in the project folder

```
bin/test
```

## Project structure

### /bin

Binary files to execute the app, tests or others.

### /app

Contains the source code of the app server.

### /app/resources

Resources of the RESTful API. Each resource has its own folder containing:

- **controller**

  Controllers receive HTTP requests, validate them and run the corresponding service
passing the payload pre-processed to it.

- **model**

  Models encapsulate everything that your application knows. 
They are responsible for accessing and storing the resources data.

- **router**
    
  Routes describe the URL patterns to perform HTTP operations, GET, POST, PUT, 
PATCH and DELETE on resources. Each route points to a specific controller.

- **service**

  Services encapsulate everything that your application does. 
The services are a way to decouple the actions the app can do from how to access this actions. 
A service could be accessed through the controllers for HTTP requests or alternatively 
through websockets or from an internal script.

- **tests**

  Here there are the integration and unit tests for the app.

### /utils

Files containing code that can be helpful for the app, but also can be ported 
to other apps.

## FAQs

### Why using relative path module importing ?

Deno uses relative path importing. To use absolute paths you need to implement
import-map.json

### I generated a controller, service, router and model for a resource, but it doesn't work

After generation, you need to add the router in /routes/mod.ts and the model
in AppServer.ts registerModels function.

### I get errors from a third party module dependency, how do I find the responsible module ?

Run `deno info app/main.ts` to see the dependency tree.

## ToDo

### Implement endpoint authentication **In progress**
Using Keycloak auth open source solution. 

### Update deno api generator lib

