const format = require("date-fns");
const { v4: uuid } = require('uuid');

const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require('path')

const logEvents = async (message, logName) => {
    try {
        const dateTime = `${format(new Date(), 'yyyyHHdd\tHH:mm:ss')}`;
        const logItem = `${dateTime}\t${uuid()}\t${message}`;

        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }
        await fsPromises.appendFile(path.join(__dirname, "..", "logs", logName), logItem);

    } catch (error) {
        console.error(error)
    }

}