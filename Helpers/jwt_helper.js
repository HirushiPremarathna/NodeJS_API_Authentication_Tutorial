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
    * access token is generated whenever a new user is registered or  previous user logged in
    */

    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {
            
            };
            //const secret = "some super secret"
            const secret = process.env.ACCESS_TOKEN_SECRET;
            const options = {
                // providing options to the token
                expiresIn: "30s",
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


    verifyAccessToken: (req, res, next) => {
        /**
         * if the authorization header is not present in the request
         * in order of secuirty cases should display only unauthorized
         * 
         * if authorization header is present get auth header and store 
         * it inside an array by splitting it with space
         * 
         * extract the token from the array
         * 
         * verify the token with the secret key
         * * if the token is not verified then it will throw an error
         * * if the token is verified then it will return the payload and go to next middleware
         * 
         */
        if (!req.headers['authorization']) return next (createError.Unauthorized ());

        const authHeader = req.headers['authorization'];
        const bearerToken = authHeader.split (' ');

        const token = bearerToken[1];
        
        JWT.verify (token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err) {
            /*
            if (err.name === 'JsonWebTokenError') {
                return next (createError.Unauthorized ()); // in caseof seccurity cases dont pass the error message, display as  unauthorized
            } else {
                return next (createError.Unauthorized (err.message)); //passing the actual error message when the json web token is expired
            }
            */

            //simplified version of the above code
            // it doesnt include blacklisting of tokens
            const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
            return next (createError.Unauthorized (message));
        
        }
            req.payload = payload;
            next ();
        });
    },

  signRefreshToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.REFRESH_TOKEN_SECRET;
      const options = {
        expiresIn: "1y", // refresh token expires in 1 year 
        // if refresh token has expired then user has to login again
        // if access token has expired then user get a new pair of  refresh  token and access token
        issuer: "pickurpage.com",
        audience: userId,
      };

      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message);
          return reject(createError.InternalServerError());
        }
        resolve(token);
      });
    });
  },

  // verification of refresh token 
  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
        if (err) return reject(createError.Unauthorized());
        const userId = payload.aud; //audinece in options is userId
        resolve(userId);
      });
    });
  }
  
};
    