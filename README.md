Chatbox is a project when the user could access his account and do the following operations:
- See his balance
- Deposit 
- Withdraw

Bonus implemented:
- Handle currency code validation in the cache.
- Unit tests
- Dockerize your application.

Install and Run
------------
- Prerequisites: docker and docker-compose, API

Before run the project, you need to install and run the API. API is hosted on: [https://github.com/diogojpina/chatbot-account-api][1]

Run the project

```
$ docker-compose up
```
Wait until all dependencies are installed, the project is compiled (a line with "Compiled successfully" will appear).

Usage
------------
Access:
[http://localhost:8080][2]

Demo user: diogo
Demo pass: 123456

Technologies
------------
- Angular 9
- Symfony 5
- PHP 7.4
- Composer
- Docker
- Docker Compose

Exchange API
------------
I am using [https://api.exchangeratesapi.io] because it is really good and free API.


[1]: https://github.com/diogojpina/chatbot-account-api
[2]: http://localhost:8080
[3]: https://api.exchangeratesapi.io