const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Respository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Respository {

    async create(attr) {
        // {email: example@gmail.com, password: sdsadsd}
        attr.id = this.randomId();
        const salt = crypto.randomBytes(8).toString('hex');
        const buffer = await scrypt(attr.password, salt, 64);

        const records = await this.getAll();
        const record = {
            ...attr,
            password: `${buffer.toString('hex')}.${salt}`
        }
        records.push(record);
        await this.writeAll(records);

        return record;
    }

    async comparePassword(saved, submitted) {
        //Saved is the password thats in the database (hashed.salt)
        //Supplied is the password given by user on sign in form

        const [hashed, salt] = saved.split('.');
        const hashedSubmitted = await scrypt(submitted, salt, 64);

        return hashed === hashedSubmitted.toString('hex');
    }

}

module.exports = new UsersRepository('users.json');