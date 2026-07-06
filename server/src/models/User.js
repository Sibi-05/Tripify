import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{

    fullname: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },

    profileImg: {
        type: String,
        default: "https://i.pinimg.com/736x/7e/b4/56/7eb4567657b2ff39de528ec948b79797.jpg"
    },

    bio: {
        type: String,
        default: ""
    },

    location: {
        type: String,
        default: ""
    },

    trips: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip"
        }
    ],

    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    bookmarks:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Trip"
    }
    ],

    likedTrips: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip"
        }
    ],

},
{
    timestamps: true
}
);

const User = mongoose.model("User", userSchema);
export default User;