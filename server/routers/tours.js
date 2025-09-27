import express from 'express';
import prisma from '../db.js';
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images"); // save files here
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});



const upload = multer({ storage });

router.post(
  "/upload",
  upload.array("images", 10), // up to 10 images
  (req, res) => {
    const imageUrls = req.files.map((file) => `/images/${file.filename}`);
    res.json({ imageUrls });
  }
);



router.get('/', async (req,res)=>{
    try{
        const tours = await prisma.tour.findMany({
            include:{
                images:true,
                itineraries:true,
            }
        });
        res.status(200).json(tours);
    }
    catch (error) {
    console.error('Error fetching tours:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})


router.post("/", async (req, res) => {
  const {
    title,
    description,
    available_slots,
    price,
    category_id,
    images,
    itineraries,
  } = req.body;

  try {
    await prisma.$transaction(async (tx) => {
      const newTour = await tx.tour.create({
        data: {
          title,
          description,
          available_slots,
          price,
          category_id,
        },
      });

      // Images
      if (images && images.length > 0) {
        const imageData = images.map((url) => ({
          tour_id: newTour.tour_id,
          image_url: url,
        }));
        await tx.tourImage.createMany({ data: imageData }); // ✅ fixed name
      }

      // Itineraries
      if (itineraries && itineraries.length > 0) {
        const itineraryData = itineraries.map((item) => ({
          tour_id: newTour.tour_id,
          day_number: item.day_number,
          day_title: item.day_title,
          day_description: item.day_description,
        }));
        await tx.itinerary.createMany({ data: itineraryData }); // ✅ this is fine
      }

      res.status(201).json({
        message: "Tour, images, and itineraries created successfully",
        tour: newTour,
      });
    });
  } catch (error) {
    console.error("Failed to create new tour:", error);
    res
      .status(500)
      .json({ error: "Failed to create new tour. Please try again." });
  }
});


router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await prisma.tour.findUnique({
      where: {
        tour_id: parseInt(id),
      },
      include: {
        images: true,
        itineraries: true 
      }
    });

    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }
    res.status(200).json(tour);
  } catch (error) {
    console.error('Error fetching tour:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;