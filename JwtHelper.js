import jwt from 'jsonwebtoken';

const SECRET_KEY = '94b0257a-4cfc-429d-bb0a-59d524387791';

export class JwtHelper {

    /**
     * Sign a JWT token using secret key
     * @param payload the JWT payload
     * @return {*} signed JWT token
     */
    static sign = (payload) => {
        return jwt.sign(payload, SECRET_KEY);
    }

    /**
     * Decode a JWT token
     * This function retrieve JWT data but DOES NOT verify the token signature
     * @param token the JWT token
     * @return {*} the payload of the JWT token
     */
    static decode = (token) => {
        return jwt.decode(token);
    }

    /**
     * Verify JWT signature
     * @param token the JWT token
     * @return {*} the payload of the JWT token
     */
    static verify = (token) => {
        return jwt.verify(token, SECRET_KEY,  (err, decoded) => {
            if(err) return false;

            // jwt decoded
            return decoded;
        });
    }

}