import cayegoryModel from "../models/cayegoryModel.js"
import slugify from "slugify"

export const createCategoryController = async(req,res) =>{
    try {
        const {name} = req.body
        if(!name){
            return res.status(401).send({
                message:"Ime je obavezno"
            })
        }

        const existingCategory = await cayegoryModel.findOne({name})
        if(existingCategory){
            return res.status(200).send({
                success:true,
                message:'Kategorija vec postoji'
            })
        }

        const category = await new cayegoryModel({name,slug:slugify(name)}).save()
        res.status(201).send({
            success:true,
            message:'Nova kategorija je napravljena',
            category
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error i kategorijama'
        })
    }

}

//update kategoriju
export const updateCategoryContoller = async(req,res) =>{
    try {
        const {name} = req.body
        const {id} = req.params
        const category = await cayegoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})
        res.status(200).send({
            success:true,
            message:'Kategorija updateovana uspeno',
            category
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error prilikom updatea kategorije"
        })
    }
}

//sve kategorije
export const categoryController = async (req,res) =>{
    try {
        const category = await cayegoryModel.find({})
        res.status(200).send({
            success:true,
            message:"Sve kategorije",
            category
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error prilikom ucistavanj svih kategorija"
        })
    }
}

//jedna kategorija

export const singleCategoryController = async(req,res) =>{

    try {
        const category = await cayegoryModel.findOne({slug:req.params.slug})
        res.status(200).send({
            success:true,
            message:"Uspesno",
            category
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error prilikom ucitavanja jedne kategorije"
        })
    }

}

//brisanje

export const deleteCategoryController = async(req,res) =>{
    try {
        
        const {id} = req.params
        await cayegoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success:true,
            message:'Kategorija je obrisana',
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error prilikom brisanja"
        })
    }

}