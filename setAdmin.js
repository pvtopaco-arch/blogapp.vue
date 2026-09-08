// Run this from your backend project root (same folder as index.js):
//   node setAdmin.js youremail@example.com
//
// It connects to the same MongoDB your API uses, finds the user with
// that email, and sets isAdmin to true.

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const email = process.argv[2];

if (!email) {
    console.error("Usage: node setAdmin.js <email>");
    process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log("Connected to MongoDB");

        const user = await User.findOne({ email });

        if (!user) {
            console.error(`No user found with email: ${email}`);
            process.exit(1);
        }

        user.isAdmin = true;
        await user.save();

        console.log(`Done. ${email} is now an admin.`);
        process.exit(0);
    })
    .catch((error) => {
        console.error("Error:", error);
        process.exit(1);
    });
