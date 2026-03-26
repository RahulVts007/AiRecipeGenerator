import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

    /*
    What a JWT actually looks like
    eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjQyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
    It looks like gibberish but it's three parts separated by dots:
    HEADER . PAYLOAD . SIGNATURE

    Header — what algorithm was used to sign it
    Payload — your actual data (userId, email, role etc.)
    Signature — a tamper-proof seal, generated using a secret only your server knows

    Anyone can read the payload (it's just base64). But nobody can fake the signature without knowing your secret
    */

const authMiddleware = async (req, res, next) => {

    try {

        const token = req.header('Authorization')?.replace('Bearer ', '');

        // If token doesnt exist
        if (!token) {
            return req.status(401).json({
                success: false,
                message: 'No authentication token, Access Denied'
            });
        }

        /* 
        Token Verification:
        This is the core of the whole middleware. jwt.verify does two things:
    
        Takes the token's signature and re-computes it using your JWT_SECRET (a long password only your server knows, stored safely in a .env file). If the recomputed signature matches the one on the token → it's real and untampered.
        Checks the expiry — tokens can be set to expire after 7 days, 1 hour, etc. If it's expired, this throws an error.
    
        decoded is what comes out —> your original payload data:
        */

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        /*
        Add user info to request
        req.headers     // what headers the client sent
        req.body        // the data they sent (like a form submission)
        req.params      // url parameters like /users/:id
        The key insight is — you can add your own stuff to it too. JavaScript objects are open. So when you write:
        req.user = {
            id: decoded.id,
            email: decoded.email
        };
        You're just adding a new property called user to that box. You could call it anything — req.person, req.currentUser, req.loggedIn. Convention is req.user.

        */

        req.user = {
            id: decoded.id,
            email: decoded.email
        };

        next();
    }
    catch (error) {
        console.log('Auth Middleware Error: ' , error);
        res.status(401).json({
            success: false,
            message: 'Token is not valid'
        });
    }

}

export default authMiddleware;