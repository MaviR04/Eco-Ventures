// routes/bookings.js
import express from "express";
import prisma from '../db.js';
import { authenticateToken } from '../middleware.js';
import { sendNotificationToUser } from './push.js';


const router = express.Router();


router.post("/:tourId", authenticateToken, async (req, res) => {
  const { tourId } = req.params;
  const userId = req.userId; 

  try {
    const tour = await prisma.tour.findUnique({
      where: { tour_id: parseInt(tourId) }
    });

    if (!tour) return res.status(404).json({ message: "Tour not found" });
    if (tour.available_slots <= 0) {
      return res.status(400).json({ message: "No slots available for this tour" });
    }

    const [booking, updatedTour] = await prisma.$transaction([
      prisma.booking.create({
        data: {
          user_id: userId,
          tour_id: tour.tour_id
        }
      }),
      prisma.tour.update({
        where: { tour_id: tour.tour_id },
        data: { available_slots: { decrement: 1 } }
      })
    ]);


    res.status(201).json({
      message: "Booking successful",
      booking,
      remainingSlots: updatedTour.available_slots
    });

    await sendNotificationToUser(userId, {
      title: 'Booking Confirmed 🎉',
      body: `Your booking for the ${tour.title} tour is confirmed!`, // optional deep link
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});


export default router;
