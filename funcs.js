// ((a = 3, b = 5) => {
//   console.log(a + b);
// })();

// class Person {
//   constructor(name, age) {
//     this.name = name;
//     this.age = age;
//   }

//   sayHello() {
//     console.log(
//       `Hello, my name is ${this.name} and I am ${this.age} years old.`
//     );
//   }
// }

// new Person("shammah", 8).sayHello();

const express = require("express");
const router = express.Router();

// Home page route
router.get("/", function (req, res) {
  res.send("Wiki home page");
});

// About page route
router.get("/about", function (req, res) {
  res.send("About this wiki");
});

module.exports = router;
