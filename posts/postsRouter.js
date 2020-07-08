const express = require("express");
const db = require("../data/db");

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
module.exports = router;