import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be atleast 6 characters long"],

    },
    cartItems: [
        {
            quantity: {
                type: Number,
                default: 1,
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            }
        }
    ],

    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer",
    }
},
    {
        timestamps: true,
    }
)




//hashing password before saving to db
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();

    } catch (error) {
        next(error);

    }
});

//compare password with hashed password and actual password stored in database.
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
}
const User = mongoose.model('User', userSchema);
export default User; 