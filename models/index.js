
const mongoose = require('mongoose');
const user = require('./user.js');
const indata = require('./data.js');

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/Dbuser?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.2");
    console.log("connected to  DB");

    await user.deleteMany({});
    indata.data = indata.data.map((obj) => ({ ...obj}));
    await user.insertMany(indata.data);
    console.log("Sample data uploaded!");
    process.exit();
}

main().catch((err) => {
    console.log(err);
    process.exit(1);
});