const mongoose = require('mongoose');

//User model used to store date within the database
const postSchema = new mongoose.Schema({

    photolink: {
        type: String,
        required: [true],
    },

    likenumber: {type: Number},
    description :{type: String},
    commentnumber:{type: Number},
    comments: {
        type: Array
    },
    userId: {
        type: mongoose.Types.ObjectId
    }


}, {
    timestamps: true,
    versionKey: false
});


const Post = mongoose.model('posts', postSchema);

export default Post;