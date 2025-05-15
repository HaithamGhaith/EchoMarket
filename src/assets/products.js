import { images } from './images/placeholder';

export const categories = [
  { id: 'audio', name: 'Audio' },
  { id: 'computers', name: 'Computers' },
  { id: 'smartphones', name: 'Smartphones' },
  { id: 'gaming', name: 'Gaming' },
  { id: 'accessories', name: 'Accessories' }
];

export const products = [
  // Audio Category
  {
    id: 1,
    name: "Sony WH-1000XM4",
    price: 349.99,
    image: "https://www.jopanda.com/wp-content/uploads/2021/07/71o8Q5XJS5L._AC_SL1500_-min.jpg",
    stock: 15,
    category: "audio",
    description: "Premium noise-cancelling headphones with exceptional sound quality"
  },
  {
    id: 2,
    name: "Apple AirPods Pro",
    price: 249.99,
    image: "https://cdn-eshop.jo.zain.com/images/thumbs/0005149_airpods-pro-2nd-generation_600.webp",
    stock: 20,
    category: "audio",
    description: "True wireless earbuds with active noise cancellation"
  },
  {
    id: 3,
    name: "JBL Flip 6",
    price: 129.99,
    image: "https://m.media-amazon.com/images/I/614f5R8ReXL._AC_SL1500_.jpg",
    stock: 25,
    category: "audio",
    description: "Portable waterproof speaker with powerful bass"
  },

  // Computers Category
  {
    id: 4,
    name: "MacBook Pro M2",
    price: 1499.99,
    image: "https://estore.jawwal.ps/storage/product/4968/3CGHOZcn3BlG6UKhFZiabuRcN7q0nqCbpup4hVCs.jpg",
    stock: 10,
    category: "computers",
    description: "Powerful laptop with Apple M2 chip"
  },
  {
    id: 5,
    name: "Dell XPS 15",
    price: 1799.99,
    image: "https://m.media-amazon.com/images/I/811DyJu0SgL._AC_SL1500_.jpg",
    stock: 8,
    category: "computers",
    description: "Premium Windows laptop with 4K display"
  },
  {
    id: 6,
    name: "Custom Gaming PC",
    price: 2499.99,
    image: "https://m.media-amazon.com/images/I/81SSx5mnY8L._AC_UF1000,1000_QL80_.jpg",
    stock: 5,
    category: "computers",
    description: "High-end gaming desktop with RTX 4080"
  },

  // Smartphones Category
  {
    id: 7,
    name: "iPhone 14 Pro",
    price: 999.99,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB67CtU5z-22KeiovkUeL7_UURjh97WgXgCw&s",
    stock: 15,
    category: "smartphones",
    description: "Latest iPhone with dynamic island"
  },
  {
    id: 8,
    name: "Samsung S23 Ultra",
    price: 1199.99,
    image: "https://i5.walmartimages.com/seo/Samsung-Galaxy-S23-Ultra-Cell-Phone-Factory-Unlocked-Android-Smartphone-256GB-200MP-Camera-Night-Mode-Long-Battery-Life-S-Pen-US-Version-2023-Green_472032f0-b578-4216-a56e-6cb77b013002.8861a42571c74c153042858b9b018de9.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF",
    stock: 12,
    category: "smartphones",
    description: "Premium Android phone with S-Pen"
  },
  {
    id: 9,
    name: "Google Pixel 7 Pro",
    price: 899.99,
    image: "https://m.media-amazon.com/images/I/51f4A6Tr8zL._AC_SR1000,1000_.jpg",
    stock: 10,
    category: "smartphones",
    description: "Google flagship with amazing camera"
  },

  // Gaming Category
  {
    id: 10,
    name: "PS5 Console",
    price: 499.99,
    image: "https://m.media-amazon.com/images/I/41TnqQ0prBL._AC_UF1000,1000_QL80_.jpg",
    stock: 7,
    category: "gaming",
    description: "Next-gen gaming console from Sony"
  },
  {
    id: 11,
    name: "Xbox Series X",
    price: 499.99,
    image: "https://i5.walmartimages.com/seo/Microsoft-Xbox-Series-X_b562417b-7584-4740-983b-422cb2832fb9.7ef4114105e8cbe37cc4125a3cb125f0.jpeg",
    stock: 6,
    category: "gaming",
    description: "Microsoft's most powerful console"
  },
  {
    id: 12,
    name: "Nintendo Switch OLED",
    price: 349.99,
    image: "https://m.media-amazon.com/images/I/61E4b5drxzS._AC_UF1000,1000_QL80_.jpg",
    stock: 15,
    category: "gaming",
    description: "Hybrid gaming console with OLED display"
  },

  // Accessories Category
  {
    id: 13,
    name: "Logitech MX Master 3",
    price: 99.99,
    image: "https://mcc-jo.com/wp-content/uploads/2024/03/LOGITECH-MX-MASTER-3S-WIRELESS-MOUSE-8K-DPI-TRACK-PALE-GRAY-1.jpg",
    stock: 30,
    category: "accessories",
    description: "Premium wireless mouse for productivity"
  },
  {
    id: 14,
    name: "Samsung 49\" Odyssey G9",
    price: 1299.99,
    image: "https://mcc-jo.com/wp-content/uploads/2021/02/Samsung-49-Odyssey-G9-Gaming-Monitor-2-1.jpg",
    stock: 4,
    category: "accessories",
    description: "Ultra-wide curved gaming monitor"
  },
  {
    id: 15,
    name: "Keychron Q1",
    price: 169.99,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKBQ2awbusI3kCs7yAJYGd6rA-FavQTSAxig&s",
    stock: 20,
    category: "accessories",
    description: "Custom mechanical keyboard with hot-swap"
  }
];

const WIT_AI_TOKEN = "OMKNF5NSY77C6YXNHWUITX2LDY3ELUWE"; 