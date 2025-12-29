require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./models/Admin");

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const existingAdmin = await Admin.findOne({ username: "admin" });
        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit(0);
        }

        const admin = new Admin({
            username: "admin",
            password: "password123" // In a real app, this should be changed immediately
        });

        await admin.save();
        console.log("Admin user created: admin / password123");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding admin:", error);
        process.exit(1);
    }
};

seedAdmin();
