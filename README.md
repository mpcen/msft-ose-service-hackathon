# Microsoft Open Source Engineering - GitHub Hackathon

## Pre-Reqs:

-   MySQL Server v8.0.19 X64 & MySQL Workbench v8.x
    -   For Windows: https://dev.mysql.com/downloads/file/?id=492814
    -   For MacOS: https://dev.mysql.com/downloads/file/?id=492745 and https://cdn.mysql.com//Downloads/MySQLGUITools/mysql-workbench-community-8.0.19-macos-x86_64.dmg
-   [Node v12.16.0](https://nodejs.org/dist/v12.16.0/node-v12.16.0-x64.msi)
-   VSCode w/ Prettier and ESLint extensions installed

## 1. Getting your MySQL instance ready:

Within MySQL Workbench, create a new MySQL database

```
CREATE DATABASE hackathondb;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'YOUR PASSWORD
```

---

## 2. Create a .env file in project root

Populate it with the following environment variables and credentials. For example:

```
DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=secret
DB_NAME=hackathondb
DB_PORT=3306
```

## 3. Install project and dependencies:

```
npm install
```

---

## 4. Run project in development mode:

```
npm run dev
```

---

# Good resources:

-   [Express Routes & Controllers](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes)
-   [TypeORM API Docs](https://typeorm.io/#/)
-   [TypeORM Code Samples](https://github.com/typeorm/typeorm/tree/master/sample)
-   [Node Best Practices](https://github.com/goldbergyoni/nodebestpractices#1-project-structure-practices)

# Some random how-to's and tools

## So you need some UUID's?

```
   // import uuidv4 library
   import { uuid } from 'uuidv4';
   const myId = uuid();
```

-   See more commands at [npm-uuidv4](https://www.npmjs.com/package/uuidv4)

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

-   Add them to .gitignore

---

## Q&A

1. Fix MySQL connection failure because `Client does not support authentication protocol requested by server; consider upgrading MySQL client`?
   [Here](https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server) is a good solution.

## Sample requests:

GET localhost:5000/snapshots/12345?commit=usgf873ewfewr&release=qqq&workflow=mmmmm&branch=master&run=98765

POST localhost:5000/snapshots

```
{
        "locations": [
            {
                "path": "path/to/metadata/file/package.json",
                "components": [
                    {
                        "coordinates": {
                            "type": "npm",
                            "name": "express",
                            "version": "4.0.0"
                        },
                        "usage": {
                            "devDependency": false
                        },
                        "children": [{
                        	"coordinates": {
                        		"type": "npm",
                                "name": "ajv",
                                "version": "6.11.0"
                        	}
                        }],
                        "directDependency": true
                    }
                ],
                "metadata": {
                    "commit": "jgljlgjrgjortgrtop",
                    "branch": "master",
                    "release": "",
                    "workflow": "123",
                    "run": "567"
                }
            }
        ]
    }
```
