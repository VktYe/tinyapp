# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["screenshot of URLs page"](https://github.com/VktYe/tinyapp/blob/main/docs/urls-page.png)
!["screenshot of login page"](https://github.com/VktYe/tinyapp/blob/main/docs/login.png)
!["screenshot of register page"](https://github.com/VktYe/tinyapp/blob/main/docs/register-page.png)
!["screenshot of urls-new page"](https://github.com/VktYe/tinyapp/blob/main/docs/urls-new.png)
!["screenshot of submiting URL on urls-new page"](https://github.com/VktYe/tinyapp/blob/main/docs/urls-page.png)

## Features
- Shorten URLs: Convert long URLs into 6-character short codes.
- User Authentication: Secure login and registration with hashed passwords and encrypted sessions.
- Ownership Control: Only manage URLs you create, edit or delete.
- Responsive Design: Clean, user-friendly interface powered by EJS templates.
- Tested Reliability: Unit tests ensure helper functions work flawlessly.

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session

## Getting Started

- Clone the repository.
- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.


## Project Highlights 
- Helper Functions: Modular utilities in helpers.js for email lookup and URL filtering
- Security First: Password hashed with bcryptjs, session encrypted with cookie-session.