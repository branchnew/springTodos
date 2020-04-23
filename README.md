
# springTodos

I created my spring boot application using Initializr where I added this dependencies:    
.Dev tools: improve the development-time experience.  
.JPA: Java specification for managing relational data.  
.Web: uses Spring MVC, REST and Tomcat as a default embedded server.

I started looking to my user stories and to my ER diagram to understand how to build the 
entity class and which functions I had. And I created my MVC structure and where
my classes should be.

In the beginning I used H2 database in-memory that Spring boot gives by default.
The data will not persist if you restart the application therefore is mostly used for 
development and testing. 
But I had to use accessing data with MySql, in this case I chose MySql-connector-java 
the opposite to the embedded database. Because Spring JPA Data reduces the effort of
the implementation of data access layers avoiding the boilerplate code. 

In my application.properties I had to configure the database URL, username, and password,
the SQL dialect and hibernate ddl-auto that will automatically created and updated the table 
task on application startup.That will connect my application to MySql server. 

After that, on the Task class that represents data I have created bean entity which is the 
task table stored in database.

To access to Task class details I needed to defined a repository interface which extends 
PagingAndSortingRepository. PagingAndSorting extends Crud and the only difference is that 
allows to retrieve entities using pagination and sorting. I didn't use this additional 
properties in this project but I learned something new.

Instead of implementing the business logic in the controller I created service class which 
make the code clean and I can use it in case I have to use the Task entity somewhere else
without repeating code.
In the end comes the REST controller class where I @Autowired the TaskService class and 
called the methods. 

My API is RESTful referred to Richardson Maturity Model, it uses different URI, sends
request with different methods then gets the request code back as response(created, ok, 
bad request).






 




