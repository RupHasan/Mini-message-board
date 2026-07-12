# Mini Message Board
A simple, full-stack message board application built to practice Node.js, Express, and Database integration. This project allows users to post messages and view them in a clean, modern interface.
## 🚀 Features
 * **Post Messages**: Users can enter a username and their message.
 * **Live Display**: View all posted messages in a responsive card-based layout.
 * **Modern UI**: Styled with CSS variables for easy theme customization.
 * **Asynchronous Updates**: Uses the Fetch API to post and retrieve messages without refreshing the page.
## 🛠️ Tech Stack
 * **Backend**: Node.js, Express.js
 * **Database**: MariaDB
 * **Frontend**: HTML5, Vanilla JavaScript, CSS3
## 📦 Getting Started
### Prerequisites
 * Node.js installed
 * MariaDB server running
 * A database named miniMsgBoard set up with a table containing username and msg columns.
### Installation
 1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd <your-project-folder>
   
   ```
 2. **Install dependencies:**
   ```bash
   npm install
   
   ```
 3. **Configure Database:**
   Ensure your db.js file is configured with your database credentials.
 4. **Run the server:**
   ```bash
   node server.js
   
   ```
 5. **View the project:**
   Open your browser and navigate to http://localhost:3000.
## 📝 Usage
 * Click the **"Enter Message"** button to open the submission form.
 * Fill in your name and message, then click **Submit**.
 * Your message will appear automatically in the feed.
## 💡 Acknowledgments
 * This project was completed as part of the The Odin Project curriculum.
### Tips for your Readme:
 * **Replace <your-repo-url>**: Don't forget to update the link to your actual GitHub repository.
 * **Database Schema**: If you want to be extra helpful to anyone reading your code, you might want to add a small section under "Database" that shows the SQL command you used to create the table.