const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://rajshinde2820:qlVdMZKmI1fpXjtA@cluster0.w4fsi.mongodb.net/devTinder "
     );
};


module.exports = {connectDB}
