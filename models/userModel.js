const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

// Define the User schema
const UserModel = new Schema(
  {
    fName: {
      type: String,
      require: true,
      trim: true, // Trim whitespace
      text: true,
    },
    lName: {
      type: String,
      require: true,
      trim: true, // Trim whitespace
      text: true,
    },
    username: {
      type: String,
      require: true,
      trim: true, // Trim whitespace
      unique: true,
      text: true,
    },
    email: {
      type: String,
      require: true,
      trim: true, // Trim whitespace
    },
    password: {
      type: String,
      require: true, // Required field
    },
    profilePicture: {
      type: String,
      default: "", // Default empty string
    },
    cover: {
      type: String,
      trim: true, // Trim whitespace
    },
    bMonth: {
      type: String,
      require: true, // Required field
      trim: true, // Trim whitespace
    },
    bDay: {
      type: String,
      require: true, // Required field
      trim: true, // Trim whitespace
    },
    bYear: {
      type: String,
      require: true, // Required field
      trim: true, // Trim whitespace
    },
    gender: {
      type: String,
      require: true, // Required field
    },
    verified: {
      type: Boolean,
      default: false, // Default value
    },
    friends: [
      {
        type: ObjectId,
        ref: "usermodel", // Reference to other users
      },
    ],
    followers: [
      {
        type: ObjectId,
        ref: "usermodel", // Reference to other users
      },
    ],
    following: [
      {
        type: ObjectId,
        ref: "usermodel", // Reference to other users
      },
    ],
    request: [
      {
        type: ObjectId,
        ref: "usermodel", // Reference to other users
      },
    ],
    search: [
      {
        user: {
          type: ObjectId,
          ref: "usermodel", // Reference to other users
          require: true, // Required field
        },
        createdAt: {
          type: Date,
          require: true, // Required field
        },
      },
    ],
    details: {
      bio: {
        type: String, // User bio
      },
      othername: {
        type: String, // Alternative name
      },
      job: {
        type: String, // Job title
      },
      currentcity: {
        type: String, // Current city
      },
      workplace: {
        type: String, // Workplace
      },
      college: {
        type: String, // College
      },
      highschool: {
        type: String, // High school
      },
      hometown: {
        type: String, // Hometown
      },
      relationship: {
        type: String,
        enum: [
          // Relationship status options
          "Single",
          "In A Relationship",
          "It's Complicated",
          "Married",
          "Divorced",
        ],
      },
      instagram: {
        type: String, // Instagram handle
      },
    },
    savePost: [
      {
        post: {
          type: ObjectId,
          ref: "post", // Reference to posts
        },
        saveAt: {
          type: Date,
          require: true, // Required field
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

// Export the user model
module.exports = mongoose.model("usermodel", UserModel);
