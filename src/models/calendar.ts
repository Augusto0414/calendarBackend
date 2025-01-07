import mongoose, { Schema, model, Document } from "mongoose";

export interface ICalendar extends Document {
  title: string;
  notes?: string;
  start: Date;
  end: Date;
  user: mongoose.Types.ObjectId;
}

const CalendarSchema = new Schema<ICalendar>({
  title: {
    type: String,
    required: [true, "El título es obligatorio"],
  },
  notes: {
    type: String,
    required: false,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
});

export const Calendar = model<ICalendar>("Calendar", CalendarSchema);
