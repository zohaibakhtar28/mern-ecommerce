# QuickCart

QuickCart is a full-featured e-commerce application built with React, Express, MongoDB, and various other libraries. It includes functionalities such as user authentication, product management, cart management, order processing, and more. The platform provides an admin dashboard with analytics, making it ideal for managing an online store efficiently.
Live : https://quick-cart-zipo.onrender.com/

---

## Features

- **User Authentication**: Signup, login, logout, and refresh token functionality.
- **Product Management**: Create, read, update, and delete products.
- **Cart Management**: Add to cart, remove from cart, and update quantities.
- **Order Processing**: Integrated with Stripe for secure payment handling.
- **Coupon Management**: Easily manage promotional codes for discounts.
- **Admin Dashboard**: Manage users, products, orders, and view analytics.
- **Responsive Design**: Built using Tailwind CSS for optimal responsiveness.
- **State Management**: Powered by Zustand for efficient state handling.
- **Image Uploads**: Integrated with Cloudinary for easy media management.

---

## Admin Panel and Dashboard

The admin panel offers a comprehensive dashboard for managing the e-commerce platform. Its key features include:

- **Product Management**: Create, update, and delete products.
- **Order Management**: View and manage customer orders.
- **User Management**: Manage user accounts and access.
- **Analytics**: View sales data, user activity, and product performance.



---

# Project Structure

- This repository contains the following folder structure:
  ```bash
       ├── backend/
  │   ├── controllers/
  │   ├── lib/
  │   ├── middleware/
  │   ├── models/
  │   └── routes/
  │   └── server.js

       ├── frontend/
  │   ├── node_modules/
  │   ├── public/
  │   └── src/
  │   ├── .eslint.config.js
  │   ├── index.html
  │   ├── package-lock.json
  │   ├── package.json
  │   ├── postcss.config.js
  │   ├── README.md
  │   ├── tailwind.config.js
  │   └── vite.config.js
  ├── node_modules/

  ├── .env
  ├── .gitignore
  ├── package-lock.json
  └── package.json




---

## Libraries Used

### Frontend
- **React**: For building user interfaces.
- **Zustand**: State management library.
- **React Router**: For routing.
- **Axios**: Promise-based HTTP client.
- **Framer Motion**: For animations.
- **Lucide React**: Icon library.
- **React Hot Toast**: For toast notifications.
- **Recharts**: For data visualization.
- **Stripe**: For payment processing.
- **Tailwind CSS**: For responsive and utility-based styling.

### Backend
- **Express**: Web framework for Node.js.
- **Mongoose**: For MongoDB data modeling.
- **JWT**: For secure authentication.
- **Redis**: For caching and session handling.
- **Cloudinary**: For managing images and videos.
- **Stripe**: For payment gateway integration.

---

## Installation and Setup

### Prerequisites
- Install Node.js and npm.
- Set up MongoDB, Redis, and Stripe accounts.
- Configure a Cloudinary account.

### Steps

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/zohaibakhtar28/mern-ecommerce.git
   cd mern-ecommerce
2. **Install Dependencies:**
   ```bash
   npm install
   npm install --prefix frontend
   npm install --prefix backend
3. **Setup environment variables**
   ```bash
   PORT=5000
   MONGO_URI=<Your MongoDB URI>
   UPSTASH_REDIS_URL=<Your Redis URL>
   ACCESS_TOKEN_SECRET=<Your Access Token Secret>
   REFRESH_TOKEN_SECRET=<Your Refresh Token Secret>
   CLOUDINARY_CLOUD_NAME=<Your Cloudinary Cloud Name>
   CLOUDINARY_API_KEY=<Your Cloudinary API Key>
   CLOUDINARY_API_SECRET=<Your Cloudinary API Secret>
   STRIPE_SECRET_KEY=<Your Stripe Secret Key>
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
4. **Run the application**
   ```bash
   npm run dev
   npm run dev --prefix frontend
---
### Future Enhancements

- Add automated testing with Jest or Mocha.
- Implement personalized product recommendations.
- Add multi-language support.
- Improve performance using server-side rendering (SSR) for SEO benefits.






