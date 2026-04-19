import mongoose, { Document, Schema } from 'mongoose';

export interface ISalaryHistory extends Document {
  employeeId: mongoose.Types.ObjectId;
  oldSalary: number;
  newSalary: number;
  effectiveDate: Date;
  reason?: string;
}

const SalaryHistorySchema = new Schema<ISalaryHistory>({
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  oldSalary: { type: Number, required: true },
  newSalary: { type: Number, required: true },
  effectiveDate: { type: Date, default: Date.now },
  reason: String
});

export default mongoose.model<ISalaryHistory>('SalaryHistory', SalaryHistorySchema);