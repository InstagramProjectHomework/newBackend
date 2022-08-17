const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { isEmail } = require('validator');

//User model used to store date within the database
const userSchema = new mongoose.Schema({

    userphoto: {
        type: String,
        required: [false],
    },
    username: {
        type: String,
        unique: true,
        required: [true, 'Please enter your username'],
    },
    EmailisVerified: {
        type: Boolean,
        default: false,
    },
    followernumber: {type: Number},
    followingnumber: {type: Number},
    postnumber: {type: Number},
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, 'Please enter an email'],
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [8, 'Minimum password length is 8 characters'],
        maxlength: [24, 'Maximum password length is 24 characters']
    },
    fullname: {
        type: String,
        required: [true, 'Please enter your full name.'],
    },
    bio: {
        type: String
    },
    posts: [{
        ref: 'posts',
        type: mongoose.Types.ObjectId
    }]


}, {
    timestamps: true,
    versionKey: false
});

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSaltSync(12);
    this.password = await bcrypt.hashSync(this.password, salt);
    next();
}
);

//Static method to login user
userSchema.statics.login = async (email, password) => {
    const user = await User.findOne({ email });
    if (user) {
        const auth = await bcrypt.compareSync(password, user.password);
        if (auth) return user;

        throw Error('Wrong password');
    }

    throw Error('No user with that email exist');
}

const User = mongoose.model('user', userSchema);

export default User;