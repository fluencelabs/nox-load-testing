# nox-load-testing

## Requirements
Compile k6 with a custom extension
### Windows 
`docker run --rm -it -u "$(id -u):$(id -g)" -v "${PWD}:/xk6" \
  grafana/xk6 build v0.43.1 --output k6.exe \
  --with github.com/fluencelabs/xk6-fluence@v0.0.3` 
### Macos 
`docker run --rm -it -e GOOS=darwin -u "$(id -u):$(id -g)" -v "${PWD}:/xk6" \
  grafana/xk6 build v0.43.1 \
  --with github.com/fluencelabs/xk6-fluence@v0.0.3` 
### Windows 
`docker run --rm -it -e GOOS=windows -u "$(id -u):$(id -g)" -v "${PWD}:/xk6" \
  grafana/xk6 build v0.43.1 --output k6.exe \
  --with github.com/fluencelabs/xk6-fluence@v0.0.3` 
## How to run 
`k6 run ./src/TC1.js`
