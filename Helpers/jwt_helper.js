const JWT = require ('jsonwebtoken');
const createError = require ('http-errors');

module.exports = {
    /*
    * to illustrate the InternalServerError
    * If same key value pairs are present inside payload and options
    * in this case inside options: issuer resolves to "iss" which is already 
    * present inside payload.
    * 
    * signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {   
                iss: "pickurpage.com", //issuer
              };
            //const secret = "some super secret"
            const secret = process.env.ACCESS_TOKEN_SECRET;
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
    }
    */

    /*
    * signAccessToken is a function 
    * where we generate a new signed token 
    */

    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {
            
            };
            //const secret = "some super secret"
            const secret = process.env.ACCESS_TOKEN_SECRET;
            const options = {
                // providing options to the token
                expiresIn: "1h",
                issuer: "pickurpage.com",
                audience: userId,
            };

            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    // exact internal server error should not be returned to the user
                    // therefore without return eroor rejection simply  
                    // logged the erorr message and return the error by using createError to the client
                    console.log (err.message);
                    return reject (createError.InternalServerError ());
                }resolve (token);


            });
        });
    },



}
    