import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

export const createHotel = async (req, res, next) => {
  const newHotel = new Hotel(req.body);

  try {
    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
  } catch (err) {
    next(err);
  }
};
export const updateHotel = async (req, res, next) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (err) {
    next(err);
  }
};
export const deleteHotel = async (req, res, next) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json("Hotel has been deleted.");
  } catch (err) {
    next(err);
  }
};


export const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (err) {
    next(err);
  }
};

export const getHotels = async (req, res, next) => {
  const { min, max, limit, featured, ...others } = req.query; // Extracting limit and featured from query
  const manualLimit = parseInt(limit); // Parsing limit to integer
  const minPrice = parseInt(min) || 1; // Default min price to 1 if not provided
  const maxPrice = parseInt(max) || 999; // Default max price to 999 if not provided

  try {
    let hotels;
    const priceQuery = {
      cheapestPrice: {
        $gt: minPrice,
        $lt: maxPrice
      }
    };
    const query = { ...others };
    if (min !== undefined || max !== undefined) {
      // If min or max prices are provided, add priceQuery to the query
      query['cheapestPrice'] = priceQuery.cheapestPrice;
    }

    if (featured === "true") {
      // If featured=true is provided, apply sorting by featured
      hotels = await Hotel.find(query).sort({ featured: -1 }).limit(manualLimit);
    } else {
      // If no specific conditions or featured=false, return all hotels
      hotels = await Hotel.find(query).limit(manualLimit);
    }

    res.status(200).json(hotels);
  } catch (err) {
    next(err);
  }
};


// export const getHotels = async (req, res, next) => {
//   const { min, max, limit, ...others } = req.query; // Extracting limit from query
//   const manualLimit = parseInt(limit); // Parsing limit to integer
//   const minprice = parseInt(min) || 1; 
//   const maxprice = parseInt(max) || 999; 
//   try {
//     let hotels;
//     const priceQuery = {
//       cheapestPrice: {
//         $gt: minprice,
//         $lt: maxprice
//       }
//     };
//     const query = { ...others, ...priceQuery };
//     if (req.query.featured === "true") {
//       hotels = await Hotel.find(query).sort({ featured: -1 }).limit(manualLimit);
//     } else {
//       hotels = await Hotel.find(query).limit(manualLimit);
//     }
//     res.status(200).json(hotels);
//   } catch (err) {
//     next(err);
//   }
// };

export const countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(",");
  try {
    const list = await Promise.all(
      cities.map((city) => {
        return Hotel.countDocuments({ city: city });
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};
export const countByType = async (req, res, next) => {
  try {
    const hotelCount = await Hotel.countDocuments({ type: "hotel" });
    const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
    const resortCount = await Hotel.countDocuments({ type: "resort" });
    const villaCount = await Hotel.countDocuments({ type: "villa" });
    const cabinCount = await Hotel.countDocuments({ type: "cabin" });

    res.status(200).json([
      { type: "hotel", count: hotelCount },
      { type: "apartments", count: apartmentCount },
      { type: "resorts", count: resortCount },
      { type: "villas", count: villaCount },
      { type: "cabins", count: cabinCount },
    ]);
  } catch (err) {
    next(err);
  }
};

export const getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    const list = await Promise.all(
      hotel.rooms.map((room) => {
        return Room.findById(room);
      })
    );
    res.status(200).json(list)
  } catch (err) {
    next(err);
  }
};