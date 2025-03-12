import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    try {
        const { fullname, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            fullname,
            email,
            password: hashedPassword,
            role: role || 'user', // Default role as 'user' if not provided
        });

        await newUser.save();

        // Generate JWT
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send response
        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (error) {
        console.error("Signup Error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send response
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};
