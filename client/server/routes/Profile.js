const express = require("express");
const router = express.Router();

const {auth} = require("../middlewares/auth");
const {
    deleteUser,
    updateProfile,
    getUserDetails,
    updateDisplayPicture,

} = require("../controllers/Profile");

//**********************   ************************************************* */
//                          Profile Routes
//***************************************************************************** */

//route for updating profile
router.post("/update", auth, updateProfile);

//route for deleting user
router.delete("/delete",auth, deleteUser);

//route for getting user details
router.get("/getuser", auth, getUserDetails);

//route for updatedisplaypicture
router.put("/updatedisplaypicture", auth, updateDisplayPicture);

//get enrolled courses


//exporting the router
module.exports = router;