import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["file", "folder"],
    },
    size: {
      type: Number,
      required: true,
      default: 0,
    },
    lastModified: {
      type: Date,
      required: true,
      default: Date.now,
    },
    path: {
      type: String,
      required: true,
    },
    parentPath: {
      type: String,
      required: true,
    },
    cloudinaryId: {
      type: String,
      sparse: true, // Only files will have this
    },
    url: {
      type: String,
      sparse: true, // Only files will have this
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        // Convert lastModified to ISO string for frontend
        ret.lastModified = ret.lastModified.toISOString();
        // Remove mongoose specific fields
        delete ret._id;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
      },
    },
  }
);

// Indexes for faster queries
fileSchema.index({ path: 1 });
fileSchema.index({ parentPath: 1 });

// Middleware to handle cascading deletes for folders
fileSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function () {
    if (this.type === "folder") {
      // Delete all files and folders inside this folder
      await mongoose.model("File").deleteMany({
        path: { $regex: `^${this.path}/` },
      });
    }
  }
);

// Create the model
const File = mongoose.models.File || mongoose.model("File", fileSchema);

export default File;
