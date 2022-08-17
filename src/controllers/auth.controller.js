const jwt = require('jsonwebtoken');
import User from '../models/User';
import { handleErrors } from "../errors/handler.error";
const { sendEmail } = require('../middlewares/Mailer');

//3h time in ms
const Time = (1000 * 60 * 60 * 3);

//Token creation function
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "3h"
    });
}

//Sign Up (User Registration)
module.exports.signup_post = async (req, res) => {
    //The function request the name, last name, email and password.
    const { username, email, password, fullname } = req.body;



    try {
        //Checks if the role user exists and then creates the new user with the information requested above.
        //Said user will be stored within the database.
        const user = await User.create({ username, email, password, fullname, bio: "", followernumber: 0, followingnumber: 0, userphoto: "", postnumber: 0 });

        //Then generates a token 
        const token = createToken(user._id);

        res.header({ 'Access-Control-Allow-Credentials': true });

        await sendEmail(email, token);

        //And finally sends the token within a cookie as a response so the new user can be logged in as soon as the new account is made.
        res.cookie('jwt', token, { httpOnly: true, maxAge: Time, sameSite: false, secure: false, sameSite: 'lax' });
        res.status(200).json('User registered, verify your email');
        console.log('User registered, verify your email');

    } catch (err) {
        const errors = handleErrors(err);
        console.log({ message: 'User could not be register', errors: errors })
        res.status(400).json({ message: 'User could not be register' });
    }
}



//Log In (User Authentication)
module.exports.login_post = async (req, res) => {
    res.header({ 'Access-Control-Allow-Credentials': true });
    try {

        const { email, password } = req.body;
        const user = await User.login(email, password);

        if (user) {

            const token = createToken(user._id);

            res.cookie('jwt', token, { httpOnly: true, maxAge: Time, sameSite: false, secure: false, sameSite: 'lax' });
            console.log('User logged in');
            res.status(200).json({ message: 'User is logged in', user: user.username });
            return;

        } else {

            return res.json({ message: 'User not found' });
        }

    } catch (err) {

        const errors = handleErrors(err);
        console.log({ message: 'User can not be logged in', errors: errors });
        res.status(400).json({ Error: 'User can not be logged in' });
    }
}


//Get Logged User (User Credentials And Token)
module.exports.login_get = async (req, res) => {
    try {
        res.header({ 'Access-Control-Allow-Credentials': true });
        const token = req.cookies['jwt'];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const user = await User.findById({ _id: userId });

        console.log({ user: user, token: token });
        res.status(200).json({ message: 'User is logged in', user: user });
    } catch (err) {

        handleErrors(err);
        console.log({ Error: 'Can not bring user credentials' });
        res.json({ Error: 'Can not bring user credentials' });

    }
}

//Log Out (End User Session)
module.exports.logout_get = async (req, res) => {
    const token = req.cookies['jwt'];
    try {

        res.header({ 'Access-Control-Allow-Credentials': true });
        res.cookie('jwt', 'expired', { maxAge: 1 });
        console.log('Token:', token);
        res.status(200).json('User was logged out successfully');


    } catch (err) {

        handleErrors(err);
        console.log({ Error: 'User can not be logged out' });
        res.json({ Error: 'User can not be logged out' });

    }
}



//User Update (Modify User Credentials)
module.exports.user_update = async (req, res) => {
    const { username, fullname, email, bio } = req.body;
    try {
		const user = await User.findById({ _id: req.params.userId});
		if (user) {
			try {
				const updatedUser = await User.findByIdAndUpdate(
					{ _id: user.id },
					{
						username: username,
						fullname: fullname,
						bio: bio,
						email: email
					},
					{ new: true }
				);

				console.log({ message: 'User updated', user: updatedUser });
				return res.status(200).json({ message: 'User updated', user: updatedUser });

			} catch (err) {

				handleErrors(err);
				console.log({ message: 'User could not be updated' });
				return res.json({ Error: 'User could not be updated' });

			}
        }
        console.log({ message: 'User not found' });
		res.status(404).json({ message: 'User not found' });

	} catch (err) {

		handleErrors(err);
		console.log({ Error: 'Valid ObjectId missing' });
		res.json({ Error: 'Valid ObjectId missing' });

	}
}

moudles.exports.verifyEmail = async (req, res) => {
    try{
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById({ _id: userId });
        if(user){
            try{
                const updatedUser = await User.findByIdAndUpdate({ _id: user.id }, {EmailisVerified:true});
                console.log({ message: 'User Email verified.', user: updatedUser});
				return res.status(200).json({ message: 'User verified'});

            }catch (err) {
                handleErrors(err);
				console.log({ message: 'User could not be updated' });
				return res.json({ Error: 'User could not be updated' });
            }
        }
        console.log({ message: 'User not found' });
		res.status(404).json({ message: 'User not found' });
    }catch (err) {
        console.log({ Error: 'Can not bring token' });
        res.json({ Error: 'Can not bring token' });
    }

}

