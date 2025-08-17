# 🏥 Mediva – Smart Healthcare Management System

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen?logo=mongodb)
![Vite](https://img.shields.io/badge/Vite-Frontend-yellow?logo=vite)
![License](https://img.shields.io/badge/License-Academic-blue)

## 📌 Overview
**Mediva** is a MERN stack application designed to digitalize and streamline hospital services.  
It simplifies processes such as **doctor appointment booking, blood test scheduling, and medical equipment rental** while ensuring secure authentication and real-time interaction.  

This project was developed as part of an academic submission to showcase practical application of **full-stack web development**.

---

## 🎥 Demo
👉 [Watch Project Demo](./04e64ec1-c7c3-4391-8e96-2fed44bd3922.mp4)

---

## ✨ Features
- 👨‍⚕️ **Doctor Module** – Appointment booking, scheduling, patient interaction  
- 🧪 **Blood Test Module** – Pathology test requests, reporting  
- 🏥 **Medical Equipment Module** – Rent hospital beds, oxygen cylinders, and more  
- 🔐 **User Authentication** – Secure login system with session handling  
- ⚡ **Real-time Updates** – Socket.io integration for instant communication  
- 📄 **PDF Reports** – Auto-generated medical and billing reports  

---

## 🛠 Tech Stack
**Frontend:** React, Vite, Bootstrap, Styled-Components, Leaflet  
**Backend:** Node.js, Express.js, Socket.io  
**Database:** MongoDB Atlas  
**Other Tools:** Axios, jsPDF, ESLint  

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Rasikkaa/Mediva.git
cd Mediva
````

### 2️⃣ Backend Setup

```bash
cd server
npm install
npm run dev   # or nodemon index.js
```

🔧 Create a `.env` file inside `/server` with:

```
MONGO_URI=your_mongodb_atlas_connection_string
PORT=8000
JWT_SECRET=your_secret_key
```

### 3️⃣ Frontend Setup

```bash
cd ../front-end
npm install
npm run dev
```

Now visit 👉 `http://localhost:5173`

---

## 📂 Project Structure

```
Mediva/
 ├── server/        # Backend (Node.js, Express, MongoDB)
 │   ├── controllers/
 │   ├── models/
 │   ├── routes/
 │   └── index.js
 ├── front-end/     # Frontend (React + Vite)
 │   ├── src/
 │   ├── public/
 │   └── package.json
 ├── README.md
 └── .gitignore
```

---

## 🚀 Future Enhancements

* 📱 Mobile App Integration (Flutter)
* 
---

## 👨‍💻 Authors

* Adwaith Anilkumar
* Anaswara K K
* Akhil P
* Nandakishore J P
* **Rasi P**

Guided by **Dr. Nikesh P (Assistant Professor, CSE Dept, GEC Wayanad)**


---

## 📜 License

This project is developed for **academic purposes** only.


