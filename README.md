# CoCreate Frontend

CoCreate is a **real-time collaborative document editor** that supports text, code, tables, and flowcharts. It enables multiple users to work together seamlessly with **live updates, AI assistance, and role-based permissions**.

## 🚀 Live Demo  
* Frontend: [CoCreate (Netlify)](https://cocreatecolab.netlify.app)  
* Backend: [CoCreate API (Render)](https://cocreate-el2b.onrender.com)
* Backend Repository: [CoCreate Backend](https://github.com/garimabhayanaa/CoCreate-backend)

---

## 📂 Project Structure
```frontend/ 
│── src/ 
│ ├── components/ # Reusable UI components (Chat, Editor, OnlineUsers, etc.) 
│ ├── pages/ # App pages (Dashboard, Documents, Login, etc.) 
│ ├── context/ # Theme and user context 
│ ├── stylesheets/ # CSS files 
│ ├── App.js # Main React component │ 
├── index.js # React entry point 
│── public/ 
│── .env # Environment variables (Netlify) 
│── netlify.toml # Netlify deployment settings 
│── package.json # Dependencies & scripts 
└── README.md
```

---

## 🔧 **Installation & Setup**
### **1. Clone the Repository**
```sh
   git clone https://github.com/your-username/cocreate-frontend.git
   cd cocreate-frontend
```
### **2. Install Dependencies**
```sh
   npm install
```
### **3. Create a .env File**
Create a .env file in the root directory and add:

* REACT_APP_API_BASE_URL=https://cocreate-el2b.onrender.com
* REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
* REACT_APP_FIREBASE_AUTH_DOMAIN=cocreate-ed5e1.firebaseapp.com
* REACT_APP_FIREBASE_PROJECT_ID=cocreate-ed5e1
* REACT_APP_FIREBASE_STORAGE_BUCKET=
* REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
* REACT_APP_FIREBASE_APP_ID=

### **4. Run Locally**
```sh
   npm start
```
### **5.Deployment (Netlify)**
Push changes to GitHub and Netlify will automatically deploy.
To manually trigger a redeploy:
```sh
netlify deploy --prod
```
---

 ## Features
* ✅ Real-time collaboration using Socket.IO
* ✅ Supports text, code, tables, and flowcharts
* ✅ Role-based access (Owner, Editor, Viewer)
* ✅ Live AI assistance using Gemini API
* ✅ Upload & edit .txt, .csv, .md, .py, .js, .cpp, etc.
* ✅ Dark mode support

 ## Tech Stack
* Frontend: React, TailwindCSS

* Backend: Node.js, Express, MongoDB

* Real-time: Socket.IO

* Auth: Firebase

* Deployment: Netlify (Frontend), Render (Backend)

## License
This project is open-source under the MIT License.
