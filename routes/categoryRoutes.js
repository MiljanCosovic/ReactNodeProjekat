import express from 'express'
import { isAdmin, requireSignIn } from './../middlewares/authMiddleware.js';
import { categoryController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryContoller } from '../controllers/categoryController.js';

const router = express.Router()


//rute

//kreiraj kategoriju
router.post('/create-category', requireSignIn,isAdmin,createCategoryController)


//update kategoriju
router.put('/update-category/:id', requireSignIn,isAdmin,updateCategoryContoller)

//sve kategorije

router.get('/get-category', categoryController)

//sve kategorije

router.get('/single-category/:slug', singleCategoryController)

//brisanje kategorije

router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryController)




export default router

