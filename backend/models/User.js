import db from '../config/db.js'
import bcrypt from 'bcrypt.js'

class User {
    /*
    1. Hash the password
    2. Insert the new user into the DB
    3. DB returns the inserted row (because of RETURNING)
    4. pg wraps it → result.rows = [ {user} ]
    5. You unwrap it → result.rows[0] = {user}
    6. Return the clean user object to the caller
    */

    static async create({ email, password, name }) {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await db.query(
            // return id , email , name , created_at -> fetches user after inserting it into the db
            // if not return we have to fetch by SELECT statement in second query
            `INSERT INTO USERS (email , password_hash , name)
            VALUES($1 , $2 , $3)
            RETURNING id , email , name , created_at`,
            [email, hashedPassword, name]
        );

        return result.rows[0];
    }

    static async findByEmail (email){
        const result = await db.query(
            `SELECT * FROM users WHERE email = $1`
            [email]
        );

        return result.rows[0];
    }

    static async findById (id){
        const result = await db.query(
            `SELECT id , email , name , created_at , updated_at FROM users WHERE id = $1`
            [id]
        );
        return result.rows[0];
    }

    static async updateUser (id , updates){
        // destructuring updates object containing the new values
        const {name , email} =  updates;

        // COALESSCE if new name is prvided then use it, if null then keep existing name from db
        // COALESCE(value , value from db(also called fallback) )
        const result = await db.query(
            `UPDATE users
            SET name = COALESCE($1 , name),
            email = COALESCE($2 , email)
            Where id = $3
            RETURNING id , email , name , updated_at`,
            [name , email , id]
        );

        return result.rows[0];
    }

    static async updatePassword (id , newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword , 10);

        await db.query(
            `UPDATE users SET password_hash = $1 WHERE id = $2`,
            [id , hashedPassword]
        );

    }

    static async verifyPassword(plainPassword , hashedPassword){
        return await bcrypt.compare(plainPassword , hashedPassword);
    }

    static async delete(id){
        await db.query ('DELETE FROM users WHERE id = $1' , [id]);
    }

}

export default User;

