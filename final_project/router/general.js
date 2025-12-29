const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password){
    if(!isValid(username)){
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully added"});
    } else{
        return res.status(403).json({message: "User already exists"});
    }
  }

  return res.status(403).json({message: "Unable to register"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let bookByAuthor = [];

  //retrieves all the book keys
  const bookKeys = Object.keys(books);

  //Checks if the author matches the requested on and adds it to the new array
  bookKeys.forEach((key) => {
    if (books[key].author == author){
        bookByAuthor.push(books[key]);
    }
  });

  if (bookByAuthor.length > 0){
    return res.status(200).json(bookByAuthor);
  }else {
    return res.status(403).json({ message: "Author not found." });;
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let bookByTitle = [];

    //retrieves all the book keys
    const booksKey = Object.keys(books);

    //Checks if the title matches the requested one
    booksKey.forEach((key) =>{
        if(books[key].title == title){
            bookByTitle.push(books[key]);
        }
    })

    //If title is found then returns the book details.
    if(bookByTitle.length > 0){
        return res.status(200).json(bookByTitle);
    }
    
  return res.status(300).json({message: "Title not found."});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if(books[isbn]){
    return res.status(200).json(books[isbn].reviews);
  }

  return res.status(300).json({message: "Review not found"});
});


const getBooks = () => {
    axios.get('/')
        .then(response => {
            console.log("Books available in the shop:");
            console.log(response.data);
        })
        .catch(error => {
            console.error("Error fetching books:", error.message);
        });
};

const getBooksByIsbn = (isbn) => {
    axios.get(`/isbn/${isbn}`)
        .then(response => {
            console.log(`Details for ISBN ${isbn}:`);
            console.log(response.data);
        })
        .catch(error => {1
            console.error(`Error fetching book with ISBN ${isbn}:`, error.message);
        });
};

const getBooksByAuthor = (author) => {
    axios.get(`/author/${author}`)
        .then(response => {
            console.log(`Books by author "${author}":`);
            console.log(response.data);
        })
        .catch(error => {
            console.error(`Error fetching books by author "${author}":`, error.message);
        });
};

const getBooksByTitle = (title) => {
    axios.get(`/title/${title}`)
    .then(response => {
        console.log(`${title}`);
        console.log(response.data);
    })
    .catch(error =>{
        console.error(`Error fetching books by author "${title}": `, error.message);
    })
} 

// Call the function
getBooks();
getBooksByIsbn(1);
getBooksByAuthor("Chinua Achebe");
getBooksByTitle("Fairy Tales");
module.exports.general = public_users;
