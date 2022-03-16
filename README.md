# Ticketing

An application allowing users to buy and sell tickets online. Built with NodeJS microservice backend, MongoDB persistance layer and NATS Steaming Service handling inter-service communication. All services are Dockerized and can be deployed to a Kubernetes cluster with provided deployment files.

It was created for the sole purpose of learning about NodeJS microservice architecture and challenges.
This project is the followup to [dgabka/micro-blog](https://github.com/dgabka/micro-blog) which was just an introduction to the microservice topic.
It is much more advanced as it features i.e. JWT authentication, MongoDB persistance layer, Event-based communication and tests.

## App Overview

There are 5 backend services, one npm package, a client service and k8s deployments for all services and databases.

1. Auth service handles user authentication. After successful signin/signup it provides the user with JWT stored in a cookie.
1. Tickets service handles creating and updating tickets, as well as informing other services about the changes via nats.
1. Orders service handles creating and updating orders, as well as informing other services about the changes via nats.
1. Payments service records credit card charges via stripe and informs services about successful payments.
1. Expiration service keeps track of the expiration date and time of created orders utilizing bullmq and redis for that purpose.
1. Common module holds the common code used across different services distributed as an npm package.
1. Client module is the frontend of the application
1. Infra holds kubernetes deployments and services configuration

### Deployment to a local cluster

In root directory of the project run: `skaffold run`

To stop: `skaffold delete`

### Testing

Each backend service except for expiration has unit tests. To run them, simply cd into that project and run `npm test`

### Disclosure

This project was created as the practical part of [Microservices with Node JS and React](https://www.udemy.com/course/microservices-with-node-js-and-react/) course.

Most of the backend code was written coding along or ahead of the course. The only part I did not code and have copied from the course is the client code, as I was not interested in NextJS/React at the time.
