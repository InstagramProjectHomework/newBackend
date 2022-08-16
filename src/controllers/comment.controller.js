import Post from '../models/Post';
import Comment from '../models/Comment';
import User from '../models/User';
const jwt = require('jsonwebtoken');

import { handleErrors } from "../errors/handler.error";


module.exports.createcomment = async (req, res) => {
    const token = req.cookies['jwt'];
    if(!token) return res.status(403).json({message: 'Invalid token'});
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.userid= decoded.id;
    Comment;
    User;
    try{
       const user = await User.findById(req.userid);
       if(!user) return res.status(404).json({message: 'User not found'});
       const comment = {
        userphoto: user.userphoto,
        username: user.username,
        userid: req.userid,
        commentcontent: req.commentcontent
       }
       const newComment = await Comment.create(comment);
       console.log(newComment);

       await Post.findByIdAndUpdate(
        {_id : req.params.postid},
        {$push : {comments: newComment._id}},
        {new : true}
        );
        res.status(200).json({message: 'Comment Created successfully: ',newComment});

    }catch (err) {
				console.log(handleErrors(err));
				console.log({ Error: 'Comment could not be created' });
				return res.json({ Error: 'Comment could not be created' });
    }
}

module.exports.getcomment = async(req,res) => {
    const token = req.cookies['jwt'];
    if(!token) return res.status(403).json({message: 'Invalid token'});
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    Comment;
    try{
        const comment = await Comment.findById(req.params.commentid);
        if(comment){ res.status(200).json({message: 'Comment found!' , comment});}else{ res.status(404).json({message: 'Comment not found!'});}

       

    }catch (err) {
        handleErrors(err);
        console.log({ Error: 'Can not bring comment.' });
        res.json({ Error: 'Can not bring comment.' });
    }
}