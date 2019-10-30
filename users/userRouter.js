const express = require("express");
const router = express.Router();

const db = require("./userDb");
const dbPost = require("../posts/postDb");

router.use(express.json());

router.post("/", validateUser, (req, res) => {
  db.insert(req.body)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: "Server error: " + error
      });
    });
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  dbPost
    .insert(req.body.text, req.user.id)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: "Server error: " + error
      });
    });
});

router.get("/", (req, res) => {
  db.get()
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      res.status(500).json({ errorMessage: "Server error" + error });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  db.getById(req.user.id)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: "Server error: " + error
      });
    });
});

router.get("/:id/posts", validateUserId, (req, res) => {
  console.log(req.user.id);
  db.getUserPosts(req.user.id)
    .then(posts => {
      if (!posts.length) {
        res.status(404).json({ message: "No posts found" });
      } else {
        res.status(200).json({ posts });
      }
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: "Server error: " + error
      });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  db.remove(req.user.id)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: "Server Error: " + error
      });
    });
});

router.put("/:id", validateUserId, (req, res) => {
  db.update(req.user.id, req.body)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: "Server Error: " + error
      });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  db.getById(req.params.id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(404).json({ message: "invalid user id" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Server error: " + error.message
      });
    });
}

function validateUser(req, res, next) {
  if (!req.body) {
    res.status(404).json({ message: "missing user data" });
  } else if (!req.body.name) {
    res.status(404).json({ message: "missing required name field" });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "missing post data" });
  } else if (!req.body.text) {
    res.status(400).json({ message: "missing required text field" });
  } else {
    next();
  }
}
module.exports = router;
