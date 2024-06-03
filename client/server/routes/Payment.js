const express = require('express');
const router = express.Router();

const {
    capturePayment,
    verifySignature

} = require('../controllers/Payments');


const {auth , isStudent, isAdmin} = require("../middlewares/auth");

//route for creating payment
router.post("/capturepayment", auth, isStudent, capturePayment);

//route for verifying signature
router.post("/verifysignature", verifySignature);


//exporting the router
module.exports = router;