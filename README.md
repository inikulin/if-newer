# if-newer
Run npm task only if any of source files are newer than destination.

## Install
```sh
npm install if-newer
```

## Usage
```
if-newer [src] [dest] [command]
```

E.g.:
```sh
    "scripts": {
        "build": "if-newer src/**/*.js dest/**/*.js babel"
    },
```

## Author
Ivan Nikulin (ifaaan@gmail.com)