import userModel from "../models/userModel.js"
import { comparePassword, hashPassword } from './../helpers/authHelp.js';
import orderModel from "../models/orderModel.js";
import JWT from "jsonwebtoken"
import nodemailer from 'nodemailer'



const transporter = nodemailer.createTransport({
    service: "Gmail", 
    auth: {
      user: "hypershop211@gmail.com",
      pass: "glhr dcro xtzm wbps",
    },
  });

  const sendVerificationEmail = (email, userId) => {
    const verificationLink = `http://localhost:3000/verify/${userId}`;
  
    // Slanje e-maila
    const mailOptions = {
      from: "hypershop211@gmail.com",
      to: email,
      subject: "Verifikacija naloga",
      html: `<p>Kliknite na sledeći link kako biste verifikovali vaš nalog: <a href="${verificationLink}">Verifikuj se</a></p>`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Greška pri slanju e-maila:", error);
      } else {
        console.log("E-mail poslat:", info.response);
      }
    });
  };

export const registerController = async (req,res) =>{
    try {
        const {name,email,password,phone,address} = req.body
        //validacija
        if(!name){
            return res.send({error: 'Ime je obavezno!'})
        }
        if(!email){
            return res.send({message: 'Email je obavezan!'})
        }
        if(!password){
            return res.send({message: 'Sifra je obavezna!'})
        }
        if(!phone){
            return res.send({message: 'Telefon je obavezan!'})
        }
        if(!address){
            return res.send({message: 'Adresa je obavezna!'})
        }

        //provera usera
        const exsistingUser = await userModel.findOne({email})
        //zauzet user
        if(exsistingUser){
            return res.status(200).send({
                success:false,
                message: 'Vec ste registrovani. Prijavite se!',
            })
        }

        //registroavni user
       const hashedPassword = await hashPassword(password)

        //save

        const user = await new userModel({name,email,phone, address,password:hashedPassword}).save()
        sendVerificationEmail(email, user._id);
        res.status(201).send({
            success:true,
            message: 'Uspesno ste se registrovali!',
            user
        })

    
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message: 'Eror in Registration',
            error
        })
    }
}

export const verifyController = async (req, res) => {
    
    const {id} = req.body;
    try {
      // Verifikacija je uspešna, ažurirajte isVerified svojstvo korisnika u bazi
      const verifiedUser = await userModel.findByIdAndUpdate(id,
        {
         isVerified:true,
        },
      );
      res.status(200).send({
        success: true,
        message: "Korisnik je uspešno verifikovan.",
        verifiedUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Greška pri ažuriranju korisnika." });
    }
  };

//POST LOGIN

export const loginController = async (req,res) =>{
    try {
        const {email,password} = req.body
        // validacija
        if(!email || !password){
            return  res.status(200).send({
                success:false,
                message: 'Netacan Username ili Password',
            })
        }
        //provera usera
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(200).send({
                success:false,
                message: 'Email nije registrovan',
                 
            })
        }

        const userVer = await userModel.findOne({email})
        if(!userVer.isVerified){
            return res.status(200).send({
                success:false,
                message: 'Niste verifikovani', 
            })
        }

        const match = await comparePassword(password,user.password)
        if(!match){
            return res.status(200).send({
                success:false,
                message: 'Netacna sifra',
            })
        }

        //token

        const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET, {expiresIn:'7d'})
        res.status(200).send({
            success:true,
            message: 'Uspesno ulogovni',
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role,
            },
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message: 'Eror in Login',
            error
        })
    }

}
//forgotPasswordController

export const forgotPasswordController = async(req,res) =>{
    try {
        const {email, newPassword} = req.body
        if(!email){
            res.status(400).send({message:"Email je obavezan"})
        }
        if(!newPassword){
            res.status(400).send({message:"Nova sifra je obavezana"})
        }
        //provera
        const user = await userModel.findOne({email})
        //validacija
        if(!user){
            return res.status(404).send({
                success:false,
                message:'Pogresan Email ili Odgovor'
            })
        }
        const hashed = await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id,{password:hashed})
        res.status(200).send({
            success:true,
            message:"Uspesno ste promenili lozinku"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Something went wrong",
            error
        })
    }
}

//test controller

export const testController = (req,res) =>{
   try {
    res.send("Protected Routes")
   } catch (error) {
    console.log(error)
    res.send({error})
   }
}


export const updateProfileController = async (req, res) => {
    try {
      const { name, email, password, address, phone } = req.body;
      const user = await userModel.findById(req.user._id);
      //password
      if (password && password.length < 6) {
        return res.json({ error: "Lozinka je obavezna i duga 6 karaktera" });
      }
      const hashedPassword = password ? await hashPassword(password) : undefined;
      const updatedUser = await userModel.findByIdAndUpdate(
        req.user._id,
        {
          name: name || user.name,
          password: hashedPassword || user.password,
          phone: phone || user.phone,
          address: address || user.address,
        },
        { new: true }
      );
      res.status(200).send({
        success: true,
        message: "Profil uspesno updateovan",
        updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error prilikom updatea profila",
        error,
      });
    }
  };

  //narudzbine
  

  export const getOrdersController = async (req, res) => {
    try {
      const orders = await orderModel
        .find({ buyer: req.user._id })
        .populate("products", "-photo")
        .populate("buyer", "name");
      res.json(orders);
    } catch (error) {
      console.error("Error While Getting Orders:", error);
      res.status(500).send({
        success: false,
        message: "Error While Getting Orders",
        error: error.stack, 
      });
    }
  };

  //narudzbine admin

export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

//narudzbine status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};
// narudzbine delete 
// narudzbine delete 
export const deleteOrderController = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Proverite da li narudžbina postoji
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Narudžbina nije pronađena.',
      });
    }

    // Proverite da li je status narudžbine "Delivered"
    if (order.status !== 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'Narudžbinu možete obrisati samo ako je status "Delivered".',
      });
    }

    // Obrišite narudžbinu
    const deletedOrder = await orderModel.findByIdAndRemove(orderId);

    if (!deletedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Narudžbina nije pronađena prilikom brisanja.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Narudžbina je uspešno obrisana.',
    });
  } catch (error) {
    console.error('Greška pri brisanju narudžbine:', error);
    res.status(500).json({
      success: false,
      message: 'Greška pri brisanju narudžbine.',
      error: error.stack,
    });
  }
};


//useri

export const usersController = async (req, res) => {
  try {
    // Filtriraj korisnike sa rolom 0 i isVerified true
    const users = await userModel.find({ role: 0, isVerified: true });

    res.status(200).send({
      success: true,
      message: "Svi verifikovani korisnici sa rolom 0",
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error prilikom ucitavanja verifikovanih korisnika sa rolom 0",
    });
  }
};

//brisanje


export const deleteUserController = async(req,res) =>{
  try {
      
      const {id} = req.params
      await userModel.findByIdAndDelete(id)
      res.status(200).send({
          success:true,
          message:'Korisnik je obrisan',
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