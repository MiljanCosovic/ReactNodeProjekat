import express from "express";
import {registerController, loginController, testController,forgotPasswordController, updateProfileController, verifyController, getOrdersController, getAllOrdersController, orderStatusController, usersController, deleteUserController, deleteOrderController} from "../controllers/authController.js"
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";



//router object
const router = express.Router()

//routing 
//REGISTER || METHOD POST
router.post('/register', registerController)

router.post('/verify', verifyController)

//Login || POST
router.post('/login' , loginController)

//Zaboravljena sifra || POST
router.post('/forgot-password', forgotPasswordController)



//test routes
router.get('/test',requireSignIn,isAdmin, testController)

//protected route ayth

router.get('/user-auth', requireSignIn,(req,res) =>{
    res.status(200).send({ok: true})
})


router.get("/admin-auth", requireSignIn,isAdmin,(req,res) =>{
    res.status(200).send({ok: true})
})


//update profile
router.put("/profile", requireSignIn, updateProfileController);

//narudzbine
router.get("/orders", requireSignIn, getOrdersController);

//sve narudzbine
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put("/order-status/:orderId", requireSignIn, isAdmin, orderStatusController);

//delte narudzbina
router.delete('/delete-order/:orderId', requireSignIn, isAdmin, deleteOrderController);

//korisnici

router.get('/get-users', usersController, requireSignIn,isAdmin)

//brisanje krosinika
router.delete('/delete-user/:id', requireSignIn, isAdmin, deleteUserController)



export default router