import express from 'express'
import { isAdmin, requireSignIn } from './../middlewares/authMiddleware.js';
import { brainTreePaymentController, braintreeTokenController, createProductController, deleteProductController, getProductController, getSingleProductController, productCategoryController, productCountController, productFiltersController, productListController, productPhotoController, realtedProductController, searchProductController, updateProductController } from './../controllers/productController.js';
import formidable from 'express-formidable'

const router = express.Router()

//routes

router.post('/create-product',requireSignIn, isAdmin,formidable(), createProductController)

//svi produkit

router.get('/get-product', getProductController)

//jedan podukt
router.get('/get-product/:slug', getSingleProductController)

//slika

router.get('/get-photo/:pid', productPhotoController)

//update
router.put("/update-product/:pid",requireSignIn,isAdmin,formidable(),updateProductController);

//bisanje producta

router.delete('/product/:pid', deleteProductController)

//filter
router.post('/product-filters', productFiltersController)

//product count
router.get('/product-count', productCountController)

//product per page
router.get('/product-list/:page', productListController)

//search product
router.get('/search/:keyword', searchProductController)

//slicni proizvodi
router.get("/related-product/:pid/:cid", realtedProductController);

//category wise product
router.get("/product-category/:slug", productCategoryController);

//placanje

//token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);









export default router