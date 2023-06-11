const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

// let users = [];
let users = [
    {
        "username":"customer",
        "password":"customer123"
    },
];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
// Task 6 - write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Task 7 - Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("Customer successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.put("/auth/review/:isbn", (req, res) => {
    //Task 8 - Write your code here
    const isbn = req.params.isbn; // Get the ISBN from request parameters
    const review = req.query.review; // Get the review from request query
    const username = req.session.authorization.username; // Get the username from session (assuming session middleware is used)
  
    // Check if the ISBN exists in the books object
    if (books.hasOwnProperty(isbn)) {
      const book = books[isbn]; // Get the book object for the given ISBN
  
      // Check if the user has already posted a review for this book
      if (book.reviews.hasOwnProperty(username)) {
        // If the user has already posted a review, modify the existing review
        book.reviews[username] = review;
        console.log("1", book.reviews)
        console.log("1.a", books)
        return res.send( "The review for the book with ISBN  1 has been added/updated." );
      } else {
        // If the user has not posted a review, add a new review for the book
        book.reviews[username] = review;
        console.log("2", book.reviews)
        console.log("2.a", books)
  
        return res.send( `The review for the book with ISBN  ${isbn} has been added/updated.` );
      }
    } else {
      // If the ISBN does not exist in the books object, return an error message
      return res.send({ message: "Book not found with the provided ISBN." });
    } 
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Task 9 - 
    const isbn = req.params.isbn; // Get the ISBN from request parameters
    const username = req.session.authorization.username; // Get the username from session (assuming session middleware is used)
  
    // Check if the ISBN exists in the books object
    if (books.hasOwnProperty(isbn)) {
      const book = books[isbn]; // Get the book object for the given ISBN
  
      // Check if the user has posted a review for this book
      if (book.reviews.hasOwnProperty(username)) {
        // If the user has posted a review, delete the review
        delete book.reviews[username];
        return res.send( `Reviews for the ISBN  ${isbn} posted by the user ${username} deleted .` );
      } else {
        // If the user has not posted a review, return an error message
        return res.send( "Review not found for the given ISBN and username." );
      }
    } else {
      // If the ISBN does not exist in the books object, return an error message
      return res.send( "Book not found with the provided ISBN." );
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
