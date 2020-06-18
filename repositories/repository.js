const fs = require('fs');
const crypto = require('crypto');


module.exports = class Respository {
    constructor(filename) {
        if (!filename) {
            throw new Error('Creating a repo requires a filename');
        }
        this.filename = filename;
        try {
            fs.accessSync(this.filename);
        } catch (err) {
            console.log(err, 'File does not exist. Creating one now.');
            fs.writeFileSync(this.filename, '[]');
        }
    }

    async create(attr) {
        attr.id = this.randomId();
        const record = await this.getAll();
        record.push(attr);
        await this.writeAll(record);

        return attr;
    }

    async getAll() {
        return JSON.parse(await fs.promises.readFile(this.filename, {
            encoding: 'utf8'
        }));
    }

    async writeAll(records) {

        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
    }

    randomId() {
        const id = crypto.randomBytes(4).toString('hex');
        return id;
    }

    async getOne(id) {
        //Get all the records
        const retrieve = await this.getAll();
        //Find the one that matches the ID and return it.
        return retrieve.find(record => record.id === id);
        //Throw an error if no ID matches a record
        if (!record) {
            throw new Error(`No matching record found with id: ${id}`);
        }
    }

    async delete(id) {
        //Retrieve the latest records
        const retrieve = await this.getAll();
        //Filter out the ones which don't match the given ID
        const filteredRetreive = retrieve.filter(record => record.id !== id);
        //Return the filtered records back 
        await this.writeAll(filteredRetreive);

    }
    async update(id, attr) {
        //Get all the current records
        const retrieve = await this.getAll();
        //Filter the ones we want based on ID
        const record = retrieve.find(record => record.id === id);

        if (!record) {
            throw new Error(`No matching record with id:${id} found!`);
        }

        //Update the record with attr
        Object.assign(record, attr);
        await this.writeAll(retrieve);
    }

    async getOneBy(filters) {
        //Get the current records
        const retrieve = await this.getAll();
        //Iterate through the records

        for (let record of retrieve) {
            let found = true;

            for (let key in filters) {
                if (record[key] !== filters[key]) {
                    found = false;
                }
            }

            if (found === true) {
                return record;
            }
        }

    }
}