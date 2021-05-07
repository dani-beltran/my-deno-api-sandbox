# my-deno-playground

This is just a dummy CRUD API to test out Deno

## How to run the API server

Execute in the project folder

```
bin/run
```
```
 OPTIONS
 -d        Run it in development mode. It runs a watcher and doesnt check 
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

## Notes

Deno uses relative path importing. To use absolute paths you need to implement
import-map.json
