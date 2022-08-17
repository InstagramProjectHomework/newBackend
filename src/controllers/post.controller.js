import Post from '../models/Post';
import User from '../models/User';
const jwt = require('jsonwebtoken');
import { handleErrors } from "../errors/handler.error";

module.exports.create_post = async (req, res) => {
    const {photolink, comments} = await req.body;
    const token = req.cookies['jwt'];

    if(!token) return res.status(403).json({message: 'Invalid token'});
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.userId= decoded.id;
    console.log(decoded);
    User;
    try {
        const post ={
            userId:decoded.id,
            photolink: photolink,
            likenumber: 0,
            commentnumber: 0,
            comments: comments
        }
        const newPost = await Post.create(post);
        console.log(newPost);

        const userData = await User.findById(req.userId);
        let postnumber = userData.postnumber;
        postnumber++;
        //Add Id to relate user and post
        await User.findByIdAndUpdate(
            {_id: req.userId},
            {$push: {posts: newPost._id}},
            {new : true}
        );
        //
        await User.findByIdAndUpdate(
            {_id: req.userId},
            { postnumber: postnumber },
            {new : false}
            );
        
        res.status(200).json({message: 'Created Post: ',post: newPost});
        console.log({message: 'Post created successfully: ',newPost});
    }catch (err) {
				console.log(handleErrors(err));
				console.log({ Error: 'Post could not be created' });
				return res.json({ Error: 'Post could not be created' });
    }
}

module.exports.allposts = async(req,res) => {
    const posts = await Post.find({});
    res.status(200).json({posts});
}

module.exports.getpostbyid = async(req, res) => {
    const post = await Post.findById({_id: req.params.postid});
    res.status(200).json({post});
}