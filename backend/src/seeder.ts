import mongoose from "mongoose";
import dotenv from "dotenv";
import slugify from "slugify";
import dns from "node:dns";
import { Product } from "./models/Product";
import { Category } from "./models/Category";

dotenv.config();
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI not defined");
  process.exit(1);
}

const categoriesList = [
  "Grocery",
  "Mobiles",
  "Fashion",
  "Electronics",
  "Home",
  "Appliances",
  "Travel",
  "Beauty",
  "Vehicles",
];

/* ===================================================== */
/* 🔥 WORKING CATEGORY IMAGE POOLS (NO BROKEN LINKS)    */
/* ===================================================== */

const categoryImages: Record<string, string[]> = {
  Grocery: [
    "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQr5j-x2slkl7KsiDdOwde3NswRMk0GP5pFzATZ-smBbJssYCjcH6dzEL25qq6D31hJBza0673NT-lnfb-vsyYkVvS6QeYOLhCZbcmXllGkpy_bJu8E597hTw",
    "https://juniorsnutrition.com/cdn/shop/files/1Front_662d6220-958b-45cf-ac1a-40922f10e777.jpg?v=1758352582&width=800",
    "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRaWMqEq4qW2a4YxGFAJUTOlLMtL36vMDPV6h1nQ9fvPJJhydIq5fy5KDnh0l8ap9e33gA9RPJFk_Y4IG4OIY-u8gxqM5Bd2o1JQM3EixwAIWLnyGJdrOhFCS0emloj2g&usqp=CAc",
    "https://m.media-amazon.com/images/I/81PXdrYUToL._SX679_PIbundle-2,TopRight,0,0_AA679SH20_.jpg",
  ],

  Mobiles: [
    "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRgpi6Dy8mCiFjAw7Nj7WdqGZ4kMDIQyGd-tEDdQvVvjsE-KTWjCmjL_wOpiRKA-eXI9vn8ZfzaBfc1Qlei7ljhPq2ZqnFnNOPus8r2rTCdlZz7kWnZt9xO",
    "https://m.media-amazon.com/images/I/61+g6KrDXdL.jpg",
    "https://m.media-amazon.com/images/I/71YzJwmRFCL._AC_UF1000,1000_QL80_.jpg",
    "https://in.static.webuy.com/product_images/Phones/Phones%20Android/SGOOPIX8256GHAUNLA_l.jpg",
  ],

  Fashion: [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfE0SVWFyB5Pr2JoP32cgNvRZvgQnzGdmlXA&s",
    "https://nobero.com/cdn/shop/files/Go_through_front.jpg?v=1732862026",
    "https://www.beyoung.in/api/cache/catalog/products/shirt_squre_image_update_14_3_2022/grey_cotton_solid_shirts_for_men_base_02_05_2024_700x933.jpg",
    "https://m.media-amazon.com/images/I/717v75o8ceL._AC_UY1000_.jpg",
  ],

  Electronics: [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3Wb0UrOBadnuJnKkOr5Zu3NhkRWc0NlbCaQ&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNpOrHKmlDpsV7M11RLIEVfqS_vQ6N5kE4Mg&s",
    "https://m.media-amazon.com/images/I/71R6fEX2LFL.jpg",
    "https://www.boat-lifestyle.com/cdn/shop/files/ACCG6DS7WDJHGWSH_0.png?v=1727669669",
  ],

  Home: [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTe53egpKm9iG7T6_5tzfGeX1iO4VqA1f5FhQ&s",
    "https://m.media-amazon.com/images/I/61eHMsgYtkL._AC_UF894,1000_QL80_.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFgz13QKPiPSYFFeO2p8wws6Cg1ODWoUG32Q&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7PVQX1l0dRmXVNhth1BoGeqUEJhHyScO0Kg&s",
  ],

  Appliances: [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKmj1cpSeHMYhFRHtw1jkB9xGJykPDM6pelg&s",
    "https://rukminim2.flixcart.com/image/480/640/xif0q/microwave-new/l/c/l/-original-imagsn4prgthn6ph.jpeg?q=90",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoTMaFZrmpqLwMCYAsLGRR8C0nQeHKzV3RCw&s",
    "https://kaydeeelectronics.in/cdn/shop/files/untitled-design-2024-07-14t122536361-669376fa3720f.webp?v=1720940307&width=1946",
  ],

  Travel: [
    "https://modernquests.com/cdn/shop/files/inateck-carry-on-travel-backpack-40l-black-1.jpg?v=1716108665",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaR-F8gXnmJvcALfvbfEHcDkAILWHPObHvXA&s",
    "https://images-cdn.ubuy.co.in/660b8b22caa6286415341e43-wolf-walker-5-8-person-camping-tent.jpg",
    "https://rhinokraft.in/cdn/shop/files/orangeblack.jpg?v=1722590905",
  ],

  Beauty: [
    "https://m.media-amazon.com/images/I/618yuQkzzgL._AC_UF894,1000_QL80_.jpg",
    "https://images-cdn.ubuy.co.in/690eddacaafa3d5d4d08b793-revlon-essentials-1875w-frizz-control.jpg",
    "https://m.media-amazon.com/images/I/61YVyDv6rbL._AC_UF1000,1000_QL80_.jpg",
    "https://m.media-amazon.com/images/I/61GgobTLCsL._AC_UF1000,1000_QL80_.jpg",
  ],

  Vehicles: [
    "https://cpimg.tistatic.com/5817123/b/1/sporty-look-electric-scooters.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq1g_se2Y2GDfwU1Qx8dWTfl6GiQtjB9wPsA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8blcNb373tGj6B4k7qTUCMfPd5FQiVIm8tA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRE5QqaACybT2ge_IodeBJD2418cBV0VAFiPw&s",
  ],
};

/* ===================================================== */
/* 🔥 PRODUCT LIST (KEEPING YOUR STRUCTURE)              */
/* ===================================================== */

const baseProducts: Record<string, string[]> = {
  Grocery: [
    "Organic Basmati Rice",
    "Premium Olive Oil",
    "Whole Wheat Bread",
    "Almonds 1kg",
  ],
  Mobiles: [
    "iPhone 15 Pro",
    "Samsung Galaxy S24",
    "OnePlus 12",
    "Google Pixel 8",
  ],
  Fashion: [
    "Slim Fit Jeans",
    "Oversized Hoodie",
    "Formal Shirt",
    "Running Sneakers",
  ],
  Electronics: [
    "MacBook Pro M3",
    "Gaming Laptop RTX",
    "Bluetooth Speaker",
    "Wireless Earbuds",
  ],
  Home: [
    "Luxury Sofa Set",
    "Dining Table 6 Seater",
    "King Size Bed",
    "Office Chair",
  ],
  Appliances: [
    "Double Door Refrigerator",
    "Microwave Oven",
    "Air Conditioner",
    "Washing Machine",
  ],
  Travel: [
    "Travel Backpack",
    "Hard Trolley Suitcase",
    "Camping Tent",
    "Sleeping Bag",
  ],
  Beauty: [
    "Luxury Face Cream",
    "Hair Dryer",
    "Matte Lipstick",
    "Perfume Spray",
  ],
  Vehicles: [
    "Electric Scooter",
    "Sport Motorcycle",
    "Car Dash Camera",
    "Car Vacuum Cleaner",
  ],
};

/* ===================================================== */
/* 🔥 PRODUCT GENERATOR                                  */
/* ===================================================== */

const generateProducts = (categoryId: any, categoryName: string) => {
  const imagesPool = categoryImages[categoryName];

  return baseProducts[categoryName].map((name, index) => {
    const image1 = imagesPool[index % imagesPool.length];
    const image2 = imagesPool[(index + 1) % imagesPool.length];

    return {
      name,
      slug: slugify(name, { lower: true }),
      description: `Premium quality ${name} in ${categoryName} category.`,

      price: mongoose.Types.Decimal128.fromString(
        (Math.floor(Math.random() * 50000) + 1000).toString()
      ),

      stock: Math.floor(Math.random() * 100) + 10,
      category: categoryId,
      images: [image1, image2],

      averageRating: Number(
        (Math.random() * (5 - 3.5) + 3.5).toFixed(1)
      ),
      totalReviews: Math.floor(Math.random() * 300) + 20,

      features: [
        "Premium Build Quality",
        "Best in Category",
        "Top Rated Product",
      ],

      variants: [],
      tags: [categoryName.toLowerCase()],
      isActive: true,
    };
  });
};

/* ===================================================== */
/* 🔥 SEED LOGIC                                         */
/* ===================================================== */

const seedData = async () => {
  try {
    console.log("🌱 Connecting to DB...");
    await mongoose.connect(MONGO_URI);

    console.log("🗑 Clearing old data...");
    await Product.deleteMany();
    await Category.deleteMany();

    console.log("📂 Creating categories...");
    const categories = await Category.insertMany(
      categoriesList.map((name) => ({
        name,
        slug: slugify(name, { lower: true }),
      }))
    );

    let allProducts: any[] = [];

    categories.forEach((category) => {
      const generated = generateProducts(category._id, category.name);
      allProducts = [...allProducts, ...generated];
    });

    console.log("📦 Inserting products...");
    await Product.insertMany(allProducts);

    console.log("✅ Seeding completed successfully!");
    process.exit(0);

  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedData();