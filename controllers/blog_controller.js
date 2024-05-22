import blog_model from "../models/blog_model.js";
import user_model from "../models/user_model.js";
import mongoose from "mongoose";

export const blog = async (req, res, next) => {
    // return res.status(200).json({message:"There is no blog yet"});
    let allblogs;
    try{
        allblogs = await blog_model.find();
    } catch (e){
        return res.status(500).json({message:`${e}`});
    }
    return res.status(200).json({allblogs});
};

export const getBlogByUserID = async (req, res, next) => {
    // return res.status(200).json({message:"There is no blog yet"});
    let allblogs;
    let userID = req.query.id;
    try{
        if(userID != null){
            allblogs = await blog_model.find({user: userID});
        }else{

            allblogs = await blog_model.find();
        }
    } catch (e){
        return res.status(500).json({message:`${e}`});
    }
    return res.status(200).json({allblogs});
};

export const getBlogByID = async(req, res, next) => {
    const blogID = req.params.id;
    let blog;
    try{
        blog = await blog_model.findById(blogID);
    } catch(e){
        return res.status(500).json({message:`${e}`});
    }
    return res.status(200).json({blog});
    
}

export const addblog = async(req, res, next) => {
    const {title, description, image, dateAndTime, user} = req.body;

    let existingUser;
    try {
        existingUser = await user_model.findById(user);
    } catch (e) {
        console.log(e);
    }

    if(!existingUser){
        return res.status(400).json({message: "You don't have an account, please register"});
    }

    const blog = new blog_model({title, description, image, dateAndTime, user});
    // try{
    //     blog.save();
    // }
    // catch (e){
    //     console.log(e);
    // }
    // res.status(200).json({message:"Blog saved successfully"});

    try {
        // const session = await mongoose.startSession();
        // session.startTransaction();
        // await blog.save({session});
        blog.save();
        existingUser.blog.push(blog._id);
        existingUser.save();
        
        // await existingUser.save({session});
        // await session.commitTransaction();
        // session.endSession();
    } catch (e) {
        console.log(e);
        res.status(500).json({message:e});
    }
    res.status(200).json({message:"Blog saved successfully"});
}

export const updateBlog = async (req, res, next) => {
    const blogId = req.params.id;
    let existingBlog;
    const {title, description, image, dateAndTime}=req.body;
    try{
        existingBlog = await blog_model.findById(blogId);
        if (!existingBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        await blog_model.findByIdAndUpdate(blogId,{title,description,image,dateAndTime, user: existingBlog.user});
    } catch(e) {
        return res.status(500).json({message:`${e}`});
    }
    return res.status(200).json({message:"Blog is updated"});
}

export const deleteBlog = async (req, res, next) => {
    const blogID = req.params.id;
    let delBlog;
    try {
        // await blog_model.findByIdAndDelete(blogID);
        delBlog = await blog_model.findByIdAndRemove(blogID).populate("user");
        await delBlog.user.blog.pull(delBlog);
        await delBlog.user.save();
    } catch (e) {
        return res.status(500).json({message:`${e}`});
    }
    return res.status(200).json({message:"Blog is deleted"});
}