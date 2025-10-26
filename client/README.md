# VeriLeaf - AI-Powered Environmental Impact Verification

## 🌱 Project Overview

VeriLeaf is an innovative platform that uses AI-powered vegetation analysis to verify environmental impact and enable carbon credit trading. The system analyzes before/after satellite imagery to calculate vegetation indices and generate impact scores for environmental projects.

## 🚀 Quick Start

### Prerequisites
- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Python 3.8+ installed
- Git

### Installation Steps

1. **Clone the repository**
```sh
git clone <YOUR_GIT_URL>
cd VeriLeaf/client
```

2. **Install Node.js dependencies**
```sh
npm install
```

3. **Install AI Pipeline dependencies**
```sh
# Windows
install_ai_dependencies.bat

# Linux/Mac
chmod +x install_ai_dependencies.sh
./install_ai_dependencies.sh
```

4. **Start the AI server**
```sh
# Windows
start_ai_server.bat

# Linux/Mac
./start_ai_server.sh
```

5. **Start the frontend**
```sh
npm run dev
```

The application will be available at `http://localhost:5173` with the AI backend running on `http://localhost:5000`.

## 🤖 AI Features

- **Vegetation Analysis**: Calculates NDVI, EVI, NDWI, SAVI, LAI, and FVC indices
- **Impact Scoring**: Generates 0-100 environmental impact scores
- **Real-time Processing**: Live analysis of uploaded before/after images
- **Confidence Assessment**: Statistical reliability of analysis results
- **CO2 Estimation**: Environmental impact quantification

## 📊 How to Use

1. Navigate to the **Verify** page
2. Upload before and after images or use sample images
3. Click "Run Analysis" to process the images
4. View detailed results including:
   - Impact score and category
   - Vegetation index changes
   - Confidence levels
   - CO2 offset estimates

## 🛠️ Technology Stack

### Frontend
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

### AI Backend
- Python
- Flask
- OpenCV
- NumPy
- SciPy
- scikit-image

## 📁 Project Structure

```
VeriLeaf/client/
├── src/                    # React frontend source
├── ai_pipeline/           # Python AI backend
│   ├── vegetation_analyzer.py
│   ├── api_server.py
│   └── requirements.txt
├── start_ai_server.py     # AI server startup script
└── INTEGRATION_GUIDE.md   # Detailed integration guide
```

## 🔧 Development

### Lovable Integration
**URL**: https://lovable.dev/projects/ef18123e-0cdb-4e96-8ad1-f5a4426e249a

You can edit this code using:
- **Lovable**: Visit the project URL and start prompting
- **Your IDE**: Clone and push changes (changes sync with Lovable)
- **GitHub**: Edit files directly in the browser
- **GitHub Codespaces**: Cloud-based development environment

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/ef18123e-0cdb-4e96-8ad1-f5a4426e249a) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/ef18123e-0cdb-4e96-8ad1-f5a4426e249a) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
