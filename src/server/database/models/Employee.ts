import { Schema, model, models, Document, Types } from "mongoose";

export interface IEmployee extends Document {
  userId: Types.ObjectId;
  employeeId: string;
  position: string;
  department: string;
  skills: string[];
  contactInfo: {
    phone: string;
    emergencyContact: string;
  };
  status: "active" | "inactive" | "on_leave";
  hireDate?: Date;
  teams?: Types.ObjectId[];
}

interface IEmployeeCounter extends Document {
  _id: string;
  seq: number;
}

const counterSchema = new Schema<IEmployeeCounter>(
  {
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
  },
  { _id: true }
);

const Counter = model<IEmployeeCounter>("Counter", counterSchema);

const employeeSchema = new Schema<IEmployee>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
    },
    position: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      required: true,
      default: [],
    },
    contactInfo: {
      phone: {
        type: String,
        required: true,
      },
      emergencyContact: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["active", "inactive", "on_leave"],
      default: "active",
    },
    hireDate: {
      type: Date,
      default: Date.now,
    },
    teams: {
      type: [Schema.Types.ObjectId],
      ref: "Team",
      default: [],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

employeeSchema.pre<IEmployee>("validate", async function (next) {
  if (this.isNew && !this.employeeId) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { _id: "employeeId" }, // Buscar por _id string
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      ).exec();

      this.employeeId = `EMP-${counter.seq}`;
      next();
    } catch (error: unknown) {
      next(
        error instanceof Error
          ? error
          : new Error("Error al generar ID secuencial")
      );
    }
  } else {
    next();
  }
});

export const Employee =
  models.Employee || model<IEmployee>("Employee", employeeSchema);
