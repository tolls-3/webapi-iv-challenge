const express = require("express");

const router = express.Router();

const dbPost = require("./postDb");

router.use(express.json());

router.get("/", (req, res) => {
  dbPost
    .get()
    .then(post => {
      res.status(200).json(post);
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: "Server error: " + error.message
      });
    });
});

router.get("/:id", validatePostId, (req, res) => {
  dbPost
    .getById(req.post.id)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: "Server error: " + error.message
      });
    });
});

router.delete("/:id", validatePostId, (req, res) => {
  dbPost
    .remove(req.post.id)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: "Server error: " + error.message
      });
    });
});

router.put("/:id", validatePostId, (req, res) => {

    dbPost
    .update(req.body)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(error => {
        console.log(error)
      res.status(200).json({
        errorMessage: "Server error " + error.message
      });
    });
});

// custom middleware

function validatePostId(req, res, next) {
  const id = req.params.id;
  dbPost
    .getById(id)
    .then(post => {
      if (post) {
        req.post = post;
        next();
      } else {
        res.status(404).json({ message: "invalid post id" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Server error: " + error.message
      });
    });
}

module.exports = router;
