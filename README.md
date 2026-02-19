# Intro
Our project creates a contact manager web app hosted on a remote server using a LAMP stack. Our goals are to implement CRUD functionality in the web app. The front end uses AJAX techniques to communicate with back end REST API, with MySQL as the underlying database.

Our site: https://poosdteam13.xyz

## Database 

- MySQL database with two tables representing a one to many relationship.
- [ERD](Documents/ERD%20Diagram.pdf)

## Front End

- We use Javascript to improve page functionality and XHR requests to communicate with the back end APIs.
- We use the Bootstrap framework to polish our UI for a modern look.
- [Use Case Diagram](Documents/Use%20Case%20Diagram.png)

## Back End

- We implemented a RESTful API to handle user data and database operations.
- We used three end points: login, registration, and contacts.
- Sensitive data is sent and received through JSON objects while simple requests for data can be made through URL (once authenticated)



## Wish List

Future features that could be implemented for professional quality:

- Import feature
- Groups for contacts
- Select multiple people for email
- Forgot Password reset
- Settings for Contacts page appearance and customization

## AI Use

AI Assistance Disclosure

This project was developed with assistance from generative AI tools:

Tool: ChatGPT (OpenAI GPT-5 family), accessed via chat.openai.com

Dates: January–February 2026

Scope:

- Debugging front-end JavaScript (event listeners, DOM rendering, edit/delete behavior) and HTML
- Troubleshooting asynchronous API calls and refresh timing issues
- MySQL query assistance
- GitHub Actions CI/CD SSH deployment debugging
- Apache/SSL configuration troubleshooting (Certbot issues)
- Lighthouse performance optimization guidance (caching, Bootstrap minimization)
- Gantt chart structuring

Nature of Use:

- Generated example snippets for JavaScript fetch/XHR structure and REST endpoint formatting
- Helped diagnose logical bugs (e.g., stale contact list refresh, misplaced DOM injection, event propagation issues)
- Provided explanations of asynchronous behavior and API response timing
- Suggested debugging strategies for deployment and SSH key configuration

All AI-generated suggestions were reviewed, tested, and substantially modified before integration. The final implementation, database schema, API structure, and deployment configuration reflect our own understanding and team decisions. AI was used as a debugging assistant, architectural sounding board, and conceptual explainer—not as a substitute for implementation.