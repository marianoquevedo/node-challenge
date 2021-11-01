# Node Challenge

Take home test for Node.js developers.

## The challenge

This challenge has been designed to measure your knowledge of Node.js, Express, Typescript and various technologies, like monorepos, databases and testing. For your exercise, you will be enhancing this API which serves as the backend for the Pleo app. Whenever a user of the app navigates to the expenses view, it calls this API to collect the list of expenses for that user.

Your objective is to write this new route to fetch the list of expenses for a given user. Right now that domain is empty, so you'll have to build everything from scratch- but you can look over at the user domain for inspiration. Please make sure that the endpoint scales adequately and supports paging, sorting and filtering. Additionally, we would also like you to write some tests for your route.

Finally, as a bonus objective, try to improve any aspect of this API. It could be to add more TS types, better security, tests, add features, graphql support, etc.

## Instructions

Fork this repo with your solution. Ideally, we'd like to see your progression through commits, and don't forget to update the README.md to explain your thought process.

Please let us know how long the challenge takes you. We're not looking for how speedy or lengthy you are. It's just really to give us a clearer idea of what you've produced in the time you decided to take. Feel free to go as big or as small as you want.

## *Changes start here*

## Install

Make sure that you have a modern version of `yarn` that supports workspaces (`>= 1.0`), then run:

```bash
yarn
```

## Start

Make sure you have a modern version of docker that supports `docker compose` and then run:

```bash
yarn start:dev
```

This will start a docker container with Postgres 10, load the `dump.sql` file into the `challenge` DB, and start the server in development mode.

## Test

### Run Unit and Mid-Level tests:

```bash
yarn test
```

### Run Acceptance tests (End-to-End):

In a different terminal instance, run this to start the server:

```bash
yarn start:dev
```

Run acceptance tests:

```bash
yarn test:acceptance
```

## Open API spec

The Open API documentation for the expenses endpoint can be found in [swagger.yaml](./swagger.yaml).

## Overview and thought process

I tried to focus mostly on the expenses domain and change as little as possible on the user domain.
I made some small fixes to the repository (for example, some tests were failing on the master branch due to configuration missing).
You can see those fixes on: [42eaab6](https://github.com/marianoquevedo/node-challenge/commit/42eaab62f32a468c97516b406b21f27885eee343), [e23891d](https://github.com/marianoquevedo/node-challenge/commit/e23891d03d51ffd4769e38d172c5729f2405c2f0), and [d133d58](https://github.com/marianoquevedo/node-challenge/commit/d133d5874e594a0eba171a441d9518fdd298b6ca).

### Endpoint definition

The endpoint definition can be found on [swagger.yaml](./swagger.yaml).  
I made some assumptions on which fields can be used to filter and sort that could be useful for the dashboard frontend.
Something that's missing and could be useful to have is to find expenses between date ranges.  
For pagination, I implemented basic pagination using offset and limit in Postgres.  
The validation of the request parameters is through [ajv](https://github.com/ajv-validator/ajv). I chose it because it's a very performant and powerful JSON schema validator and can be used to validate, parse, and serialize payloads.

### Database layer

For DB querying, I decided to use [Knex](https://knexjs.org/), which is a Query Builder. This allowed me to create the queries for the expenses endpoint very quickly and with protection against SQL injection. For consistency, I also changed the query on the user domain, so we only have one way to query the DB.

### Testing

I focused on the E2E/Acceptance tests. I did this because these are the ones that will cover most of the use cases of the endpoint. With more time I would also add unit tests and integration tests for the different components.
I modified the `dump.sql` file to have another user, that has no expenses. This is to test that the endpoint works properly in that case and that the expenses array is returned empty.

### Things that are missing due to lack of time

For this exercise, I dedicated between 4 to 5 hours.
These are things that I would like to add with more time:

- Proper authentication and authorization for the endpoint:  
Currently, the endpoint takes the userId from the query params. I think it should use a JWT, validate it, and then read the userId from the token instead of allowing anyone to query for expenses of other users.
- Unit and Integration tests:  
As mentioned above.
- DB schema improvements:  
Since the dataset is very small, the DB queries are very performant. But in the future with more data they will not scale. Table indexes are missing and a different strategy for pagination might be needed (using cursors, for example).
- Improve validation error messages:  
The current validation errors (400 status code) need more polishing and would be better to return the failed fields along with the reason for the error in an object that the calling client could consume and maybe process.
