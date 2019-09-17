# run command
    npm i && npm start;

POST http://localhost:{PORT}/api/v1/batch/<param>
    PORT - defined from env vars
    param - defined in payload.params

request example:
    POST http://localhost:8080/api/v1/batch
        request
            {
        "endpoint": {
            "url": "https://guesty-user-service.herokuapp.com/user/{userId}",
            "method": "put"
        },
        "payload": [
            {
                "params": {
                    "userId": 14
                },
                "body": {
                    "age": 30
                }
            },
            {
                "params": {
                    "userId": 29
                },
                "body": {
                    "age": 30
                }
            },
            {
                "params": {
                    "userId": 103
                },
                "body": {
                    "age": 30
                }
            }
        ]
    }