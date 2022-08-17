const cookie = require('cookie');
const time = 1000 * 60 * 60 * 4;
const expired = 1 / 1000;

module.exports.get_cookie = async (req, res) => {
    const cookies = req.cookies['jwt'];
    try {
        if (cookies) return res.json(cookies);

        return res.json('No cookies were found');

    } catch (err) {

        const errors = handleErrors(err);
        console.log({ message: 'Server Error', error: errors });
    }
}

module.exports.set_cookie = async (req, res) => {
    try {


        res.cookie('token', 'Just_a_Test_010', { httpOnly: false, secure: false, sameSite: false, maxAge: 1000 * 60 * 15 });
        res.status(200).json('Cookie should be set now');

    } catch (err) {

        console.log(err.message);
        res.json(err.message);
    }
}

module.exports.check_cookie = async (req, res) => {
    try {
        res.header({ 'Access-Control-Allow-Credentials': true });
        const cookie = req.cookies.token;
        console.log(cookie)

        if (cookie) return res.json('Cookie found');

        res.json('Cookie not found');

    } catch (err) {

        console.log(err.message);
        res.json(err.message);
    }
}

module.exports.delete_cookie = async (req, res) => {
    try {
        const cookie = req.cookies['token'];
        console.log(cookie);


        res.cookie('token', 'expired', { maxAge: 1 });
        res.status(200).json('Cookie should be deleted');

    } catch (err) {

        console.log(err.message);
        res.json(err.message);

    }
}