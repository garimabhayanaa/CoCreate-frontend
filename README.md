# CoCreate — Product Case Study

## Overview
CoCreate is a real-time collaborative document editor designed to reduce friction in shared document creation by enabling multiple users to edit content simultaneously with clear role-based permissions, live updates, and contextual AI assistance. The product was built to explore how real-time collaboration, access control, and usability tradeoffs affect user trust and efficiency in shared workspaces.

## Problem & Context

Collaborative document tools often struggle to balance real-time responsiveness, permission clarity, and ease of use, especially when multiple users with different roles interact with the same document.

Early observations showed that users frequently faced:
1. Confusion over editing rights
2. Accidental overwrites during simultaneous edits
3. Poor visibility into who was online or making changes
4. Friction when switching between content types (text, code, tables)

The goal was to design a system that enabled smooth collaboration without sacrificing control or clarity.

## Users & Assumptions

### Primary users
1. Small teams or groups working on shared documents
2. Users collaborating remotely and asynchronously

### Initial assumptions
1. Users value live updates over strict consistency
2. Clear role definitions reduce editing conflicts
3. Real-time visibility of collaborators improves coordination
These assumptions influenced early design choices around permissions, synchronization, and UI layout.

## Solution & Key Decisions

CoCreate was designed as a real-time, multi-format document editor with the following product decisions:

### 1. Role-based access 
Introduced to prevent accidental edits and make responsibilities explicit.

### 2. Support for multiple content types
Text, code, tables, and flowcharts were included to reduce context switching and keep collaboration centralized.

### 3. Live collaboration indicators
Online user presence and real-time updates were prioritized to improve awareness and reduce conflicts.

### 4. AI assistance embedded within the workflow
AI suggestions were integrated contextually rather than as a separate tool to minimize disruption.

### 5. Tradeoffs & Constraints
Several conscious tradeoffs were made during development:
1. Latency vs consistency
Real-time updates were favored over strict consistency guarantees to maintain responsiveness during collaboration.
2. Permission clarity vs speed of access
Role checks added complexity but were necessary to prevent misuse and confusion.
3. Feature breadth vs reliability
The scope was limited to core collaboration features to ensure stability under concurrent usage.

These decisions were revisited multiple times during development as edge cases surfaced.

## Iteration & Feedback

Through internal testing and trial usage:
1. Permission flows were refined to reduce ambiguity
2. UI components were adjusted to make active collaborators more visible
3. Change tracking was added to improve transparency around document edits
4. Testing with multiple concurrent users helped uncover synchronization issues and informed improvements to reliability and user experience.

## Success Signals

While not a production-scale product, CoCreate demonstrated:
1. Stable collaboration with multiple simultaneous users
2. Reduced edit conflicts due to explicit roles
3. Improved clarity around document ownership and activity
4. A reusable architecture for real-time collaborative tools

## Improvements

Given more time or real-world usage:

1. Add granular version history and rollback
2. Improve conflict resolution for edge cases
3. Introduce usage analytics to validate assumptions with data
4. Explore finer-grained permissions for larger teams

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
