import { Request, Response } from "express";
import { Calendar } from "../models/calendar";
import mongoose from "mongoose";

export class calendarController {
  static handleError = (res: Response, status: number, message: string) => {
    res.status(status).json({ ok: false, message });
  };

  static addCalendar = async (req: Request, res: Response): Promise<void> => {
    if (!req.uid) {
      res.status(400).json({
        ok: false,
        message: "User UID is required",
      });
      return;
    }

    const { title, notes, start, end } = req.body;

    if (!title || !start || !end) {
      res.status(400).json({ ok: false, message: "Missing required fields" });
      return;
    }

    const event = new Calendar({
      title,
      notes,
      start,
      end,
      user: new mongoose.Types.ObjectId(req.uid),
    });

    try {
      const saveCalendar = await event.save();
      res.status(200).json({
        ok: true,
        message: "Calendar added successfully",
        saveCalendar,
      });
    } catch (err) {
      calendarController.handleError(res, 500, "Error adding calendar");
    }
  };

  static getEventCalendar = async (req: Request, res: Response) => {
    if (!req.uid) {
      calendarController.handleError(res, 400, "User UID is required");
      return;
    }

    try {
      const events = await Calendar.find({ user: req.uid }).populate("user", "_id name");
      res.status(200).json({
        ok: true,
        events,
      });
    } catch (err) {
      calendarController.handleError(res, 500, "Error fetching calendar");
    }
  };

  static updateEventCalendar = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;

    if (!req.uid) {
      calendarController.handleError(res, 400, "User UID is required");
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      calendarController.handleError(res, 400, "Invalid event ID");
      return;
    }

    try {
      const event = await Calendar.findById(id);

      if (!event) {
        calendarController.handleError(res, 404, "Event not found");
        return;
      }

      // Verificar que el usuario sea el propietario del evento
      if (event.user.toString() !== req.uid) {
        calendarController.handleError(res, 403, "You are not authorized to update this event");
        return;
      }

      const updatedEvent = await Calendar.findByIdAndUpdate(id, updates, { new: true });

      res.status(200).json({
        ok: true,
        message: "Calendar updated successfully",
        updatedEvent,
      });
    } catch (err) {
      calendarController.handleError(res, 500, "Error updating calendar");
    }
  };

  static deleteEventCalendar = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!req.uid) {
      calendarController.handleError(res, 400, "User UID is required");
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      calendarController.handleError(res, 400, "Invalid event ID");
      return;
    }

    try {
      const event = await Calendar.findById(id);

      if (!event) {
        calendarController.handleError(res, 404, "Event not found");
        return;
      }

      // Verificar que el usuario sea el propietario del evento
      if (event.user.toString() !== req.uid) {
        calendarController.handleError(res, 403, "No autorizado para hacer dicha accion");
        return;
      }

      await event.deleteOne();

      res.status(200).json({
        ok: true,
        message: "Calendar deleted successfully",
      });
    } catch (err) {
      calendarController.handleError(res, 500, "Error deleting calendar");
    }
  };
}
