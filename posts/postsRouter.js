const express = require("express");
const db = require("../data/db");
const { response } = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    db.find()
        .then(response => {
            res.status(200).json({ message: response })
        })
        .catch(error => {
            res.status(500).json({ errorMessage: "The posts information could not be retrieved." })
        });
});

router.get("/:id", (req, res) => {
    db.findById(req.params.id)
        .then(response => {
            if ( response.length === 0 ) {
                res.status(404).json({ errorMessage: "The post with the specified ID does not exist." });
            } else if ( response ) {
                res.status(200).json({ message: response });
            }
        })
        .catch(error => {
            res.status(500).json({ errorMessage: "The posts information could not be retrieved." });
        });
});

router.get("/:id/comments", (req, res) => {
    db.findById(req.params.id)  
        .then(response => {
            db.findPostComments(req.params.id)
                .then(comments => {
                    res.status(200).json({ message: comments });
                })
                .catch(error => {
                    res.status(500).json({ errorMessage: "The comments information could not be retrieved." });
                })
        })
        .catch(error => {
            res.status(404).json({ message: "The post with the specified ID does not exist. " });
        })
});

router.post("/", (req, res) => {
    const postData = req.body
    console.log(postData);
    if ( postData.title && postData.contents ) {
        db.insert(postData)
            .then((obj) => {
                db.findById(obj.id)
                    .then(post => {
                        res.status(201).json({ message: post });
                    })
                    .catch(error => {
                        console.log(error);
                    });
            })
            .catch(error => {
                res.status(500).json({ errorMessage: "There was an error while saving posts information to database." });
            });
    } else {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    }
});

router.post("/:id/comments", (req, res) => {
    const commentData = req.body;
    if ( commentData.text ) {
        db.insertComment(commentData)
            .then((obj) => {
                db.findCommentById(obj.id)
                    .then(comment => {
                        res.status(201).json({ message: comment });
                    })
                    .catch(error => {
                        console.log(error);
                    })
            })
            .catch(error => {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            });
    } else {
        res.status(400).json({ errorMessage: "Please provide text for comment." });
    }
});

router.put("/:id", (req, res) => {
    const changes = req.body;
    if ( changes.title && changes.contents ) {
        db.findById(req.params.id)
            .then(response => {
                if ( response.length === 0 ) {
                    res.status(404).json({ errorMessage: "The post with the specified ID does not exist." });
                } else {
                    db.update(req.params.id, changes)
                    .then(count => {
                        db.findById(req.params.id)
                            .then(updatedPost => {
                                res.status(200).json({ message: updatedPost })
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    })
                    .catch(error => {
                        res.status(500).json({ errorMessage: "The post informartion could not be updated."})
                    })
                }
            })
            .catch(error => {
                console.log(error);
            });
    } else {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    }
});

router.delete("/:id", (req, res) => {
    db.findById(req.params.id)
        .then(response => {
            db.remove(req.params.id)
                .then(count => {
                    res.status(200).json({ message: response });
                })
                .catch(error => {
                    res.status(500).json({ errorMessage: "The post could not be removed." });
                });
        })
        .catch(error => {
            res.status(400).json({ errorMessage: "The post with the specified ID does not exist." });
        });
});

module.exports = router;