# EcoVentures

This is a full-stack application designed for managing and booking eco-friendly tours. It features a modern **React frontend** and a robust **Node.js + Express backend** with a **MySQL database** managed by the **Prisma ORM**.

## Prerequisites

  * **Node.js** v18+

  * **MySQL** database

  * **npm** (Node Package Manager)

## Getting Started

### 1. Clone the Repository

Clone the project to your local machine and navigate into the directory:

```
git clone https://github.com/MaviR04/Eco-Ventures.git
cd eco-venture

```

### 2. Install Dependencies

Install both frontend and backend dependencies using a single command in the root folder:

```
npm install

```

### 3. Configure Environment Variables

Create a file named `.env` in the root folder and add your database and port configurations:

```
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
PORT=3000

```

> **Note:** Replace `username`, `password`, and `database_name` with your actual MySQL credentials.

### 4. Run Prisma Migrations

Set up your database schema by generating and applying migrations, and then regenerating the Prisma client:

```
npx prisma migrate dev --name init
npx prisma generate

```

To visually inspect your database, you can use Prisma Studio:

```
npx prisma studio

```

### 5. Run the Backend Server

Start the Express backend server:

```
npm run server

```

> This runs the backend on `http://localhost:3000` by default. **Ensure the backend is running before starting the frontend.**

### 6. Run the Frontend

Start the React development server (using Vite):

```
npm run dev

```

> This typically opens the frontend at `http://localhost:5173`. The frontend automatically communicates with the backend at `http://localhost:3000`.

### 7. Test API
    
You can Curl or use Postman on the following routes to test the API
| HTTP Method | Endpoint| Purpose |
| ----- | ----- | ----- |
**GET** | localhost:3000/api/tours | Fetch all tours |
**GET** | localhost:3000/api/tours/1 | Fetch tour with ID of 1 |
**POST** | localhost:3000/api/tours | Create a new Tour |
**POST** | localhost:3000/api/bookings/1 | Create a New Booking for tour ID of 1 **(must be logged in)** |




## Project Notes

### Image Handling

Images are stored locally in the `public/images` folder.

  * The backend serves these images statically via the `express.static` middleware.

  * **Access Path:** Images are available at `/images/<filename>`.

  * **Example:** An uploaded image `abc.jpg` will be available at: `http://localhost:3000/images/abc.jpg`

### Data Integrity

  * **Cascade Delete:** Deleting a `Tour` automatically deletes its associated `TourImage` and `Itinerary` records, ensuring data integrity across relationships.

  * **Database Status:** Ensure your MySQL service is running and the database is created before running Prisma migrations.

## Useful Prisma Commands

| Command | Purpose |
| ----- | ----- |
| `npx prisma generate` | Regenerate the Prisma Client after schema changes. |
| `npx prisma studio` | Open a local web interface to view and edit database data. |
| `npx prisma migrate dev --name <migration_name>` | Create a new migration and apply it to the database. |
| `npx prisma migrate reset` | Reset the database, delete all data, and re-run all migrations. |

## Project Structure

```text
eco-venture/
├─ public/images          # Static images served by backend
├─ server/                # Express backend
│  └─ routers/            # API route handlers
├─ src/                   # Frontend React code
├─ prisma/                # Prisma schema & migrations
├─ package.json
└─ README.md              # This file
```