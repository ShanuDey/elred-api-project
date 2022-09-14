# elRed API Project
[![Deploy docker container to heroku](https://github.com/ShanuDey/elred-api-project/actions/workflows/heroku-docker-deploy.yml/badge.svg)](https://github.com/ShanuDey/elred-api-project/actions/workflows/heroku-docker-deploy.yml)

## Installation

 - Clone this repository
 - Install node modules with `npm i` command
 - Update environment variables, sample `example.env` is provied for reference
 - Start api server with `npm start` command

## Usage

 - Base URL - https://elred-api-project.herokuapp.com
 - Register user with `first_name`, `last_name`, `email` and `password` POST request body json parameters to register route - https://elred-api-project.herokuapp.com/register
 - Login with `email` and `password` POST request body json paramaters to login route - https://elred-api-project.herokuapp.com/login
 - Create a task as authenticated user with `task`, `date` and `completed` POST request body json parameters to task create route - https://elred-api-project.herokuapp.com/task/create
 - View all created tasks as authenticated user with GET request to task route - https://elred-api-project.herokuapp.com/task
 - Patch a task as authenticated user with any of these `task`, `date` and `completed` PATCH request body json parameters to task route - https://elred-api-project.herokuapp.com/task/:TASK_ID
 -  Delete a task as authenticated user with DELETE request to task route - https://elred-api-project.herokuapp.com/task/:TASK_ID

### Feel free to put a start or raise an issue
