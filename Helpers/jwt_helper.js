const JWT = require ('jsonwebtoken');
const createError = require ('http-errors');

module.exports = {
    /*
    * signAccessToken is a function 
    * where we generate a new signed token 
    */
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {
                
            };
            const secret = "some super secret"
            const options = {
                // providing options to the token
                expiresIn: "1h",
                issuer: "pickurpage.com",
                audience: userId,
            };

            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                  //  won't affect the code but it's good practice to exit the function 
                  // when the promise has been rejceted
                  return reject (err);
                }resolve (token);


            });
        });
    },
}
    