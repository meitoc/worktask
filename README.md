# WORKTASK V0.0.1

Readme Version 0.0.1
2023-12-27
This project help people create, manager and check tasts via tree model.
Unlimited version with out payment method.

The user which logged in can be called "he" on this document.

# 1. User story

## a. User acess

- Common requirement

  - [x] User subcribe the account by enter: email, password and user name
  - [x] Email and username are unique

- Email Authentication

* Creating an account

  - [x] The server send a link to his email
  - [x] He must access to the link for active his account
  - [x] After the click the link, he can access and work

* Requirement for login form:

  - [x] Login by email
  - [x] Name must start with a letter and contain only lowercase letters, numbers, and underscores
  - [x] Password:
        Length between 8 and 64 characters
        Contain at least one lowercase letter
        Contain at least one upprtcase letter
        Contain at least one degit
  - [x] Email format check

* Requirement for create account form:

  - [x] Same requiremnt with loginform

* Requirement for forgot password
  - [x] He enter his email, the sever sends a link to his email

- [ ] Google Authentication

## b.Plan

Now, this function haven't build.
Only for website admin for settup limit of function which use can use.

## c. User Infomation

- Public information.

  - [x] Username, the user can't change his username
  - [x] Avatar
  - [x] Full name

- Secret information
  - [x] Email, the user can change his email
  - [x] Password, the user can change his
  - [x] Gender
  - [x] Birthday
  - [x] Organization

## d. Space list

This is an object to group root tasks for the user. When he delete a space, all task will be go to "Your Alone Task" and "Alone Shared Task"
Space list is THE HOME PAGE if the user logged in
Space list contents all space the user owns

- Access
  - [x] Secret
- User can
  - [x] View each space content: name, color, total task quatity inside
  - [x] Add a new space
  - [x] Delete a space (all task on space will move to "Your Alone Tasks" list and "Alone Shared Tasks")
  - [x] Arrange spaces on the space list
  - [x] Change a space color on the space list
  - [x] Change a space name on the space list
  - [x] Explore a space to view it's detail
  - [x] Shared task have ✊ before it's name
  - [x] Own task have 🤠 before it's name

## e. Space detail

- [x] Secret access

### Tasks (list of task)

- User can:
  - [x] View status, name (on top of page), color of each child task
  - [x] Change status, name (on top of page), color of each child task
  - [x] Delete Child task

### Detail

- [x] User can add or change decription of space

### Setting

- [x] User can change space color
- [x] User can delete space

## f. Task detail

- [x] Secret access

#### Detail

- The user can
  - [x] Change the task status
  - [x] Add or change the task description
  - [x] Comment to the task
  - [x] Upload file to the task
  - [x] View a chart for status of child task

### Child task

This is a list of task which inside the task (lower level)

- User can:
  - [x] View status, name (on top of page), color of each child task
  - [x] Change status, name (on top of page), color of each child task
  - [x] Delete Child task

### Setting

- The user can
  - [x] Change task color
  - [x] Allow member add member (if he is a manager or an owner of the task)
  - [x] Lock accessing to the task only an owner of the task
  - [x] Lock editing to the task only an owner or a manager of the task
  - [x] Delete the task (if he is a manager or an owner of the task)
- User role
  - [x] The task owners can add other to an owner, a manager (will be a member of parent task), a user
  - [x] The task managers can add other to member if "allow member add member" setting is on.
  - [x] The task member can add other to user if "allow member add member" setting is on.

## g. Upload file

- [x] Public file and secure files can access by 2 separate domain.

### Public file

Only avatar is public file

- [x] Use AWS S2 funtion to upload a file
- [x] Before upload the image must be cut to square size, covert on the server
- [x] Image data go via the server

### Secure file

All file upload to a task just only can be download by member, manager and owwner of that task
Use AWS S2 funtion to upload and download file

- [x] Use Pre-signed URL
- [x] Expiry time: 10 minutes
- [x] Data go directly to AWS S2 server

## h. Notify

- Access
  - [x] Secret access
- Working
  - [x] reload notify list affter 15 seconds
  - [x] maximum 100 notifies
  - [x] read and unread notify
  - [x] Click to jump to other task, stay if is the current task
- Showing
  - [x] Avatar
  - [x] Day and time
  - [x] User did
  - [x] Action
  - [x] Item been affected
  - [ ] Read notify color and unread notify color
- Create new notify when
  - [x] Other user change task status
  - [ ] Other user add, delete a user
  - [ ] Other user add a comment
  - [ ] Other user add, delete a file

## i. Confirm

Show confirm box to notice the user when he change, delete a impotant infomation

- [x] Delete a space
- [x] Delete a task
- [x] Delete a file

# 2.Setting up

## a. GIT and platform to deploy

- Use a hosting or VPS to build on
- [x] Front-end on folder "front-end"

- Use a hosting or VPS to build on
  - [x] Back-end on folder "server"
  - [x] Add environment variables
  - [x] Run server

## b. Domain

### Front-end

- [x] task.{BASEURL}/
      Example: task.meitoc.net/

### Back-end

- [x] taskapi2.{BASEURL}/api/
      Example: taskapi2.meitoc.net/api

### Public file

- [x] task-file.{BASEURL}/
      Example: task-file.meitoc.net/

### Secure file

- [x] Domain is provided by AWS S3

# 3. Testing

Use Postman for testing
contact to me: lequan.bmc@gmail.com to receive the Postman request list
