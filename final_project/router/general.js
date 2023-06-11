const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "Customer already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Task 1 - Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify({books: books}, null, 4)); 
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Task 2 - Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn])
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Task 3 - Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const booksKeys = Object.keys(books);
  const matchingBooks = booksKeys.filter(isbn => books[isbn].author === author);

  if (matchingBooks.length > 0) {
    const matchingBooksDetails = matchingBooks.map(isbn => {
      return {
        isbn: isbn,
        title: books[isbn].title,
        reviews: books[isbn].reviews
      };
    });
    return res.status(200).json({booksByAuthor: matchingBooksDetails}, null, 4);
  } else {
    return res.status(404).json({ message: "No books found with the provided author." });
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Taks 4 - Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
   const booksKeys = Object.keys(books);
   const matchingBooks = booksKeys.filter(isbn => books[isbn].title === title);
 
   if (matchingBooks.length > 0) {
     const matchingBooksDetails = matchingBooks.map(isbn => {
       return {
         isbn: isbn,
         author: books[isbn].author,
         reviews: books[isbn].reviews
       };
     });
     return res.status(200).json({booksByTitle: matchingBooksDetails}, null, 4);
   } else {
     return res.status(404).json({ message: "No books found with the provided title." });
   }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Task 5 - Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
