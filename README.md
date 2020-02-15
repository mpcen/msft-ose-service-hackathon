# Microsoft Open Source Engineering - GitHub Hackathon

## To run:
```
npm install
```

---

## Commands you should know:

```
npm run dev
```
- Runs project in development mode with hot-reloading (project auto-reloads on every save)

---

```
npm run start
```
 - Compiles and builds project into ./dist directory and runs once.

---

 ## So you need some UUID's?
 ```
    // import uuidv4 library
    import { uuid } from 'uuidv4';
    const myId = uuid();
 ```
  - See more commands at [npm-uuidv4](https://www.npmjs.com/package/uuidv4)

---

## So you need some environment variables for some uber-secret stuffs?
1. Create a **.env** at the root of the project
2. define the environment variable as such:
```
MY_SECRET=1337_s3k|237
```
3. Reference the secret in code as such:
```
const MY_SECRET = process.env.MY_SECRET;
```

---

Need to ignore some files/directories so they don't get checked in?
- Add them to the .gitignore directory