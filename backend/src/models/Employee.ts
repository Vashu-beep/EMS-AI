import mongoose, { Document, Schema } from 'mongoose';

export interface IProject {
  name: string;
  description: string;
  role: string;
  technologies: string[];
  startDate?: Date;
  endDate?: Date;
}

export interface IAchievement {
  title: string;
  date: Date;
  description: string;
}

export interface IEmployee extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  profileImage?: string;
  resumePath?: string;
  skills: string[];
  projects: IProject[];
  achievements: IAchievement[];
  currentSalary: number;
  joiningDate: Date;
  isActive: boolean;
}

const ProjectSchema = new Schema<IProject>({
  name: { type: String, required: true },
  description: String,
  role: String,
  technologies: [String],
  startDate: Date,
  endDate: Date
});

const AchievementSchema = new Schema<IAchievement>({
  title: { type: String, required: true },
  date: Date,
  description: String
});

const EmployeeSchema = new Schema<IEmployee>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: String,
  department: { type: String, required: true },
  position: { type: String, required: true },
  profileImage: String,
  resumePath: String,
  skills: [String],
  projects: [ProjectSchema],
  achievements: [AchievementSchema],
  currentSalary: { type: Number, required: true },
  joiningDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// backend/src/models/Employee.ts – add after schema definition

// Create compound text index for search
EmployeeSchema.index(
  { firstName: 'text', lastName: 'text', email: 'text' },
  { weights: { firstName: 2, lastName: 2, email: 1 }, name: 'employee_search_index' }
);
// Index for department filter
EmployeeSchema.index({ department: 1 });

// For regex search, create separate indexes (already done with standard indexes)
EmployeeSchema.index({ firstName: 1 });
EmployeeSchema.index({ lastName: 1 });
EmployeeSchema.index({ email: 1 });



export default mongoose.model<IEmployee>('Employee', EmployeeSchema);