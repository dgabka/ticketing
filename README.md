# Ticketing

An application allowing users to buy and sell tickets online. Built with NodeJS microservice backend, React frontend and MongoDB persistance layer. All services are Dockerized and can be deployed to a Kubernetes cluster.

It was created for the sole purpose of learning about NodeJS microservice architecture and challenges.
This project is the followup to [dgabka/micro-blog](https://github.com/dgabka/micro-blog) which was just an introduction to the microservice topic.
It is much more advanced as it features i.e. JWT authentication, MongoDB persistance layer and tests.

### Development

Run:

```bash
skaffold dev
```

To setup all services in dev environment

### Testing

auth:

```bash
cd auth
npm test
```
