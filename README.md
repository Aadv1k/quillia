# Quillia

[!cool product demo](https://user-images.githubusercontent.com/81357878/231763540-1e498d60-bbca-49a9-86dd-b28cc51624ab.mp4)

## Get

### Docker

```
docker build -t quillia-dev .
docker run -p 3000:8080 quillia-dev # forward 8080 to 3000
```

### Build

```
npm install
npm run build:fe # build the frontend
npm run build:be # build the backend
npm run build # runs both of the scripts
```

### Server

```
npm start
```


## Frontend

The frontend is built using ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB), ![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=flat&logo=bootstrap&logoColor=white) and ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

the frontend code is open for more improvements, but the current implementation can be found at [`./public/src`](./public/src)


## Backend

The app is written in _mostly_ safe TypeScript code, here is a breakdown of the codebase. 


### Routes

Each route maps to a file in `./src/routes/`, each file exports a single function that consumes a `http.IncomingMessage` and a `http.ServerResponse` message

```
Books.ts
Issue.ts
Login.ts
Signup.ts
```

### Models

To store `.epub` documents and their covers we use [cloudinary](https://cloudinary.com/), the functionality for this is implemented within `./src/models/BookModel.ts`


The user, issues and books each have their own tables in a [PostgreSQL](https://www.postgresql.org/) database hosted at [bit.io](bit.io), each table corresponds to the name `users`, `issues`, `books`. Each table is implemented separately in it's own model files. 

```
BookModel.ts
IssueModel.ts
UserModel.ts
```

### Miscellaneous

- `./src/common/utils.ts`: contains a utility functions (eg `sendJsonResponse`) that make our code cleaner and less repetetive
- `./src/common/const.ts`: contains all constants, this included `PORT`, `MIME`, API `ERROR` blobs and even enviorment variables exported as contants (this is done to reduce the friction of moving a `.env` file)
- `./src/common/types.ts`: Contains types for our project


## API

### `POST /api/login`

#### Body

```json
{
  "email": "example@example.com",
  "password": "password123"
}
```

#### Success

```json
{
  "messaged": "found the given user",
  "status": 200,
  "error": null,
  "token": "JWT.TOKEN",
  "data": {
    "email": "example@example.com",
    "id": "2ie9du9390"
  }
}
```

#### Errors

```json
{
  "message": "unable to find user",
  "status": 404,
  "error": "user-not-found"
}
```

### `POST /api/signup`

#### Body

```json
{
  "email": "example@example.com",
  "password": "password123"
}
```

#### Success

```json
{
	"status": 201,
	"message": "successfully created new user",
	"error": null,
	"token": "JWT.TOKEN",
	"data": {
		"email": "example@example.com"
    "id": "29eiowiwofi"
	}
}
```

#### Errors

```json
{
  "message": "the request was invalid",
  "status": 400,
  "error": "bad-request"
}
```

### `GET /api/books`

#### Success

```javascript
[
  // ...
  {
    id: "8272f4b03a",
    userid: "3701ced127",
    author: "Captain Charles Johnson",
    signature: "fd2ec14aa966f02641f1498578f8ad09",
    title: "A General History of the Pirates",
    cover:
      "https://res.cloudinary.com/dbloby3uq/raw/upload/v1681303170/fd2ec14aa966f02641f1498578f8ad09.jpg",
  },
  // ...
];
```

### `POST /api/books`

#### Headers

- `Authorization`: valid jwt token
- `Content-type`: `application/epub`

#### Body

A single `.epub` document less than 20 MB

#### Succces

```json
{
  "error": null,
  "message": "successfully published a book of id a11a03a20c",
  "data": {
    "id": "a11a03a20c"
  }
}
```

#### Error

```json
{
  "message": "the given credentials were invalid",
  "status": 401,
  "error": "unauthorized"
}
```

```json
{
  "message": "the mime recieved for the resource is not valid",
  "status": 415,
  "error": "invalid-mime-for-resource"
}
```

```json
{
  "message": "resource does not exist",
  "status": 404,
  "error": "resource-not-found"
}
```

### `GET /api/issues`

#### Headers

- `Authorization`: a valid jwt token

#### Success

```json
[
  {
    "id": "8d892f5772",
    "lenderid": "a61dcba84c",
    "borrowerid": "a61dcba84c",
    "bookid": "a11a03a20c"
  }
]
```

#### Error

```json
{
  "message": "resource does not exist",
  "status": 404,
  "error": "resource-not-found"
}
```

### `POST /api/issues`

#### Headers

- `Authorization`: a valid jwt token

#### Body

```javascript
{
	lenderid: "a61dcba84c", // a user who owns the published book
	bookid: "a11a03a20c"
}
```

#### Success

```json
{
  "error": null,
  "message": "successfully created a new issue of id 8d892f5772",
  "data": {
    "id": "8d892f5772",
    "borrower": "a61dcba84c",
    "lender": "a61dcba84c",
    "book": "The Almanack of Naval Ravikant: A Guide to Wealth and Happiness"
  }
}
```

#### Error

```json
{
  "message": "the request was invalid",
  "status": 400,
  "error": "bad-request"
}
```

```json
{
  "message": "resource does not exist",
  "status": 404,
  "error": "resource-not-found"
}
```
