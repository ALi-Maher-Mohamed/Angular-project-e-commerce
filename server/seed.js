require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const Favorite = require('./models/Favorite');

const users = [
  { username: 'admin', password: 'admin123', role: 'Admin' },
  { username: 'Ali Maher', password: '000000', role: 'Customer' },
  { username: 'khaled Maher', password: '000000', role: 'Customer' },
  { username: 'amr', password: '123456Aa', role: 'Customer' },
];

const products = [
  { title: 'iPhone 9', description: 'An apple mobile which is nothing like apple', price: 599, discountPercentage: 12.96, rating: 4.69, stock: 5, brand: 'Apple', category: 'smartphones', thumbnail: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop', images: ['https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&h=400&fit=crop','https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&h=400&fit=crop','https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&h=400&fit=crop'] },
  { title: 'OPPOF19', description: 'OPPO F19 is officially announced on April 2021', price: 280, discountPercentage: 17.91, rating: 4.3, stock: 7, brand: 'OPPO', category: 'smartphones', thumbnail: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&h=300&fit=crop', images: ['https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600&h=400&fit=crop','https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=600&h=400&fit=crop'] },
  { title: 'Huawei P30', description: "Huawei's re-badged P30 Pro New Edition was officially unveiled yesterday in Germany", price: 499, discountPercentage: 10.58, rating: 4.09, stock: 2, brand: 'Huawei', category: 'smartphones', thumbnail: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&h=300&fit=crop', images: ['https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&h=400&fit=crop','https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&h=400&fit=crop'] },
  { title: 'MacBook Pro', description: 'MacBook Pro 2021 with mini-LED display may launch between September and November', price: 1749, discountPercentage: 11.02, rating: 4.57, stock: 1, brand: 'Apple', category: 'laptops', thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop', images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop','https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=400&fit=crop'] },
  { title: 'Samsung Galaxy Book', description: 'Samsung Galaxy Book S with Intel Lakefield Chip, 8GB of RAM Launched', price: 1499, discountPercentage: 4.15, rating: 4.25, stock: 8, brand: 'Samsung', category: 'laptops', thumbnail: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&h=300&fit=crop', images: ['https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&h=400&fit=crop','https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=400&fit=crop'] },
  { title: 'Microsoft Surface Laptop 4', description: 'Style and speed. Stand out on HD video calls backed by Studio Mics', price: 1499, discountPercentage: 10.23, rating: 4.43, stock: 4, brand: 'Microsoft Surface', category: 'laptops', thumbnail: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=300&h=300&fit=crop', images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=400&fit=crop','https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&h=400&fit=crop'] },
  { title: 'Infinix INBOOK', description: 'Infinix Inbook X1 Ci3 10th 8GB 256GB 14 Win10 Grey', price: 1099, discountPercentage: 11.83, rating: 4.54, stock: 6, brand: 'Infinix', category: 'laptops', thumbnail: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=300&h=300&fit=crop', images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop','https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=400&fit=crop'] },
  { title: 'HP Pavilion 15-DK1056WM', description: 'HP Pavilion 15-DK1056WM Gaming Laptop 10th Gen Core i5, 8GB, 256GB SSD, GTX 1650 4GB', price: 1099, discountPercentage: 6.18, rating: 4.43, stock: 9, brand: 'HP Pavilion', category: 'laptops', thumbnail: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=300&h=300&fit=crop', images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&h=400&fit=crop','https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=400&fit=crop'] },
  { title: 'perfume Oil', description: 'Mega Discount, Impression of Acqua Di Gio by Giorgio Armani concentrated attar perfume Oil', price: 13, discountPercentage: 8.4, rating: 4.26, stock: 0, brand: 'Impression of Acqua Di Gio', category: 'fragrances', thumbnail: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=300&fit=crop', images: ['https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&h=400&fit=crop','https://images.unsplash.com/photo-1594035910387-fea081ae7aec?w=600&h=400&fit=crop'] },
  { title: 'Brown Perfume', description: 'Royal_Mirage Sport Brown Perfume for Men & Women - 120ml', price: 40, discountPercentage: 15.66, rating: 4, stock: 10, brand: 'Royal_Mirage', category: 'fragrances', thumbnail: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=300&h=300&fit=crop', images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=400&fit=crop','https://images.unsplash.com/photo-1594035910387-fea081ae7aec?w=600&h=400&fit=crop'] },
  { title: 'Fog Scent Xpressio Perfume', description: 'Product details of Best Fog Scent Xpressio Perfume 100ml For Men', price: 13, discountPercentage: 8.14, rating: 4.59, stock: 2, brand: 'Fog Scent Xpressio', category: 'fragrances', thumbnail: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=300&h=300&fit=crop', images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=400&fit=crop','https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&h=400&fit=crop'] },
  { title: 'Non-Alcoholic Concentrated Perfume Oil', description: 'Original Al Munakh by Mahal Al Musk', price: 120, discountPercentage: 15.6, rating: 4.21, stock: 4, brand: 'Al Munakh', category: 'fragrances', thumbnail: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=300&h=300&fit=crop', images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=400&fit=crop','https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&h=400&fit=crop'] },
  { title: 'Eau De Perfume Spray', description: 'Genuine Al-Rehab spray perfume from UAE/Saudi Arabia/Yemen', price: 30, discountPercentage: 10.99, rating: 4.7, stock: 0, brand: 'Lord - Al-Rehab', category: 'fragrances', thumbnail: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=300&h=300&fit=crop', images: ['https://images.unsplash.com/photo-1594035910387-fea081ae7aec?w=600&h=400&fit=crop','https://images.unsplash.com/photo-1595425964272-fc617fa25e92?w=600&h=400&fit=crop'] },
  { title: 'Hyaluronic Acid Serum', description: "L'Oreal Paris introduces Hyaluron Expert Replumping Serum", price: 19, discountPercentage: 13.31, rating: 4.83, stock: 8, brand: "L'Oreal Paris", category: 'skincare', thumbnail: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop', images: ['https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?w=600&h=400&fit=crop','https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=400&fit=crop'] },
  { title: 'Tree Oil 30ml', description: 'Tea tree oil contains a number of compounds', price: 12, discountPercentage: 4.09, rating: 4.52, stock: 6, brand: 'Hemani Tea', category: 'skincare', thumbnail: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&h=300&fit=crop', images: ['https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=600&h=400&fit=crop','https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=400&fit=crop'] },
  { title: 'Oil Free Moisturizer 100ml', description: 'Dermive Oil Free Moisturizer with SPF 20', price: 40, discountPercentage: 13.1, rating: 4.56, stock: 3, brand: 'Dermive', category: 'skincare', thumbnail: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=300&h=300&fit=crop', images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=400&fit=crop','https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?w=600&h=400&fit=crop'] },
  { title: 'Skin Beauty Serum', description: 'rorec collagen hyaluronic acid white face serum', price: 46, discountPercentage: 10.68, rating: 4.42, stock: 1, brand: 'ROREC White Rice', category: 'skincare', thumbnail: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=300&h=300&fit=crop', images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=400&fit=crop','https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=400&fit=crop'] },
  { title: 'Freckle Treatment Cream- 15gm', description: "Fair & Clear is Pakistan's only pure Freckle cream", price: 70, discountPercentage: 16.99, rating: 4.06, stock: 0, brand: 'Fair & Clear', category: 'skincare', thumbnail: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop', images: ['https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600&h=400&fit=crop','https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?w=600&h=400&fit=crop'] },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
    await Favorite.deleteMany({});

    await User.insertMany(users);
    console.log(`Seeded ${users.length} users`);

    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products`);

    console.log('Seed complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
