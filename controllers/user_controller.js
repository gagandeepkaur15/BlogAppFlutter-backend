import user_model from "../models/user_model";
import bcryptjs from "bcryptjs";

export const getAllUsers = async (req, res, next) => {
    const allUsers = await user_model.find();
    return res.status(200).json({allUsers});
}

export const getUserById = async (req, res, next) => {
   const userId = req.params.id;
   let user;
   try {
        user = await user_model.findById(userId); 
   } catch (e) {
        return res.status(500).json({message: `${e}`});
   }
   return res.status(200).json({user}); 
}

export const userSignUp = async (req, res, next) => {
    const {name,email,password} = req.body;

    let existingUser;
    try {
        existingUser = await user_model.findOne({email});
    } catch (e) {
        console.log(e);
    }

    if(existingUser){
        return res.status(400).json({message: "Already registered, try logging in"});
    }

    const encryptedPass = bcryptjs .hashSync(password)
    const user = new user_model({name, email, password: encryptedPass});
    try{
        user.save();
    } catch (e) {
        return res.status(500).json({message: `${err}`});
    }
    return res.status(200).json({user});  
}

export const login = async (req, res, next) => {
    const {email,password} = req.body;

    let existingUser;

    try {
       existingUser = await user_model.findOne({email}); 
    } catch (e) {
        console.log(e);
    }

    if(!existingUser){
        return res.status(400).json({message: "Please register first"});
    }

    const isPasswordCorrect = bcryptjs.compareSync(password,existingUser.password);
    if(isPasswordCorrect){
        return res.status(200).json({existingUser});
    } 
    else {
        return res.status(500).json({message: "Please enter the correct password"});
    }
}

