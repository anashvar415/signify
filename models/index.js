
const mongoose = require('mongoose');
const user = require('./user.js');
const indata = require('./data.js');

async function main() {
    await mongoose.connect(process.env.MONGO,{
     useNewUrlParser: true,
  useUnifiedTopology: true});

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
