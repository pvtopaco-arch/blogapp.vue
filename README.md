# Prendster

Blog app made with Vue 3 and Express + MongoDB.

## Setup

```
npm install
```

Create a `.env` file:

```
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
VITE_BLOG_API=http://localhost:4000
```

## Run

Backend:
```
npm run server
```

Frontend:
```
npm run dev
```

## Admin account

```
email: admin@mail.com
password: admin123
```

## Endpoints

POST /users/register
POST /users/login
GET /posts/getPosts
GET /posts/getPost/:postId
POST /posts/addPost (needs login)
PATCH /posts/updatePost (needs login)
DELETE /posts/deletePost (needs login)
