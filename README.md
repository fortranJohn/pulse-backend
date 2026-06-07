# pulse-backend

📌 Pulse Backend API

A scalable social media backend built with Node.js, Express, and PostgreSQL, featuring authentication, posts, likes, comments, follow system, and a cursor-based feed.


🚀 Features
    User authentication (JWT-based)
    Create and manage posts
    Like / Unlike posts (transaction-safe)
    Comment system with counters
    Follow / Unfollow users
    Personalized feed based on follow graph
    Cursor-based pagination for scalable feeds
    Optimized SQL queries using JOINs
    Database integrity with foreign keys & constraints

    🧱 Tech Stack
    Backend: Node.js, Express.js
    Database: PostgreSQL
    Authentication: JSON Web Tokens (JWT)
    Security: bcrypt password hashing
    Other: dotenv, pg (node-postgres)

    📁 Project Structure

    pulse-backend/
    │
    ├── src/
    │   ├── modules/
    │   │   ├── users/
    │   │   ├── posts/
    │   │   ├── likes/
    │   │   ├── comments/
    │   │   ├── follows/
    │   │
    │   ├── middleware/
    │   ├── db.js
    │   └── app.js
    │
    ├── package.json
    ├── .env
    └── README.md

    ▶️ Getting Started
    1. Clone the repo   
   
    git clone https://github.com/yourusername/pulse-backend.git
    cd pulse-backend

    2. Install dependencies

    npm install

    🧠 Key Concepts Implemented
    
    Relational database design (1-to-many, many-to-many)
    Feed generation using JOINs
    Transaction handling (likes system)
    Cursor-based pagination
    Denormalization for performance (likes_count, comments_count)
    Avoiding N+1 query problem

    📈 Future Improvements
    Redis caching for feed
    WebSocket notifications
    Image upload (Cloudinary / S3)
    Rate limiting
    Refresh token authentication
    Testing (Jest / Supertest)
    Deployment (Render / Railway)

    👨‍💻 Author

Built by Temitope Ogunbiyi

Learning backend engineering through real-world system design principles and database architecture.

📜 License

MIT License