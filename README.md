
# elRed API Project
[![Deploy docker container to heroku](https://github.com/ShanuDey/elred-api-project/actions/workflows/heroku-docker-deploy.yml/badge.svg)](https://github.com/ShanuDey/elred-api-project/actions/workflows/heroku-docker-deploy.yml)

## Installation
 - Clone this repository
 - Install node modules with `npm i` command
 - Update environment variables, sample `example.env` is provied for reference
 - Start api server with `npm start` command

## Usage
 - Postman Collection - https://www.getpostman.com/collections/70acf33c7cb9c5725fac
 - Base URL 
	 - Heroku Hosted - https://elred-api-project.herokuapp.com/
	 - Localhost - http://localhost:8000/
 - Register user with `first_name`, `last_name`, `email` and `password` POST request body json parameters to `/register` route  
	 - Example - https://elred-api-project.herokuapp.com/register
	- [Optional] [Create a test create email with one click](https://ethereal.email)
		- if you are using test email then you will receive a preview email from the response
		- click on the preview email link and verify email from there
 - Login with `email` and `password` POST request body json paramaters to `/login` route 
	 - Example - https://elred-api-project.herokuapp.com/login
 - Create a task as authenticated user with `task`, `date` and `completed` POST request body json parameters to `/task/create` route
	 - Example - https://elred-api-project.herokuapp.com/task/create
 - View all created tasks as authenticated user with GET request to `/task` route
	 - Example - https://elred-api-project.herokuapp.com/task
 - Patch a task as authenticated user with any of these `task`, `date` and `completed` PATCH request body json parameters to `/task/:id` route
	 - Example - https://elred-api-project.herokuapp.com/task/:TASK_ID
 -  Delete a task as authenticated user with DELETE request to `/task/:id` route
	 - Example - https://elred-api-project.herokuapp.com/task/:TASK_ID

### Feel free to put a start or raise an issue
