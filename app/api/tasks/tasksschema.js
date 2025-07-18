import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    wallet: { type: String, required: true, unique: true },
    tasksCompleted: { type: [String], default: [] }, // Görev ID'lerini tutar
    submit: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
