# Task App 📝

A full-stack containerized To-Do List web application. After creating an account, users can manage their user information as well as To-Do style tasks in various lists.

## How to use

Check and see if the project is currently deployed [here](http://taskapp.paulsprojects.xyz). If not, a development build can be easily created with the following instructions:

- Download Docker Desktop and Git (prerequisite)
- Clone the project [repo](https://github.com/sirpaulmcd/Task-App) to your computer
- Open a terminal at the root level of the project folder and use the command `docker-compose --env-file docker-compose.env up --build`
- Open your browser to [http://localhost:3000/](http://localhost:3000/)

## Preview

New users can sign up for an account:

<p align="center">
<img src="https://sirpaulmcd.com/assets/images/task-app/sign-up.gif" alt="sign up preview" width=450 />
</p>

Existing users can sign in with email and password:

<p align="center">
<img src="https://sirpaulmcd.com/assets/images/task-app/sign-in.gif" alt="sign in preview" width=450 />
</p>

Registered users can manage their information and change their theme:

<p align="center">
<img src="https://sirpaulmcd.com/assets/images/task-app/user-management.gif" alt="user management preview" width=650 />
</p>

Users can create tasks with corresponding categories and due dates:

<p align="center">
<img src="https://sirpaulmcd.com/assets/images/task-app/create-task.gif" alt="create task preview" width=650 />
</p>

Tasks can be filtered by category using the dropdown menu. In a given view, tasks are sorted such that items with the closet due date are at the top and tasks with no due date are at the bottom.

Tasks can be deleted and updated using the side buttons:

<p align="center">
<img src="https://sirpaulmcd.com/assets/images/task-app/update-delete-tasks.gif" alt="update and delete task preview" width=650 />
</p>

Tasks can completed by checking the box on the left:

<p align="center">
<img src="https://sirpaulmcd.com/assets/images/task-app/complete-task.gif" alt="complete task preview" width=650 />
</p>

Pages are dynamically styled with mobile users in mind:

<p align="center">
<img src="https://sirpaulmcd.com/assets/images/task-app/mobile-view.gif" alt="page resize preview" width=650 />
</p>

## Stack and Deployment

Task App is built using the MERN stack:

- **M**ongoDB document database (with Mongoose)
- **E**xpressJS API backend
- **R**eactJS frontend
- **N**odeJS runtime environment

Task App is deployed using:

- Docker (containerized environments)
- DigitalOcean Droplet (remote linux virtual machine)
- Nginx (web server, reverse proxy)
- Certbot (SSL certificate)

## Learning

I chose a To-Do List style application because I didn't want to reinvent the wheel on my first attempt at a full-stack web application. Going in, I thought this project would be relatively simple. However, I was surprised to see how much critical thinking goes on behind the scenes of a typical web application. To create/deploy Task App, I needed to take in an ocean of knowledge. To help get my point across, I've organized some noteworthy technologies/concepts that were necessary for this project.

**General Web Development**

- JavaScript/Typescript languages
- NodeJS runtime environment
- User authentication/management best practices
- HTTP Protocol
- JSON Web Tokens (JWT)
- Browser Cookies

**Frontend Client**

- React library
- MaterialUI library
- React-transition-group library
- Dynamic routing
- Axios API interactions and related data management
- CSSGrid and Flexbox (Responsive styling for page resizing)

**Backend API**

- ExpressJS framework
- Postman (API development tool)
- Password storage (hash and salt)
- Managing authentication tokens/cookies
- Database CRUD operations
- Sorting, filtering, and pagination
- File uploads
- API testing (supertest)

**Database**

- MongoDB (NoSQL database)
- Mongoose (ODM library for Mongo)

**General Development and Deployment**

- Git (version control)
- GitHub Actions (automating QA checks)
- Docker (containerizing applications)
- Managing environment variables
- DigitalOcean Droplets (remote linux virtual machine)
- Linux server management and best practices
- Nginx (web server, reverse proxy)
- Registering and configuring internet domain names
- Certbot (enalbing HTTPS)

Needless to say, I'm glad to have this project under my belt. Creating and deploying a full-stack application for the first time is a huge milestone for me and I feel much more competent as a developer than when I started.

## Moving Forward

Backlog (if I feel like it):

- Implement custom user lists (currently, users can only use premade list categories)
- User list sharing (let multiple users view/manage the same list)
- Continuous Integration (server automatically serves latest docker image)
- Email verification and password recovery
- Due date notifications
- Recurring tasks
