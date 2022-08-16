const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({

    userphoto: {
        type: String
    },
    username: { 
        type: String
    },
    userid: {
        type: mongoose.Types.ObjectId
    },
    commentcontent: { type: String}
});

const Comment = mongoose.model('comments', commentSchema);

export default Comment;