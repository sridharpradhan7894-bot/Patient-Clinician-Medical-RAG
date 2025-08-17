# Patient-Clinician Medical RAG Platform

A comprehensive healthcare data management platform that enables secure patient-clinician interactions with AI-powered medical document analysis, wearable data integration, and automated report generation.

## 🏥 Project Overview

This platform provides:
- **Secure Authentication**: Role-based access for patients and clinicians
- **Document Management**: PDF upload, processing, and AI-powered analysis
- **Wearable Integration**: Fitbit and Google Fit data collection
- **Medical Analysis**: RAG-based AI analysis using local LLMs (Ollama) or OpenAI
- **Report Generation**: Automated PDF health reports
- **FHIR Compliance**: Modern healthcare data standards
- **Mobile Responsive**: Works seamlessly on desktop and mobile devices

## 🚀 Features Completed

### ✅ Core Infrastructure
- [x] FastAPI backend with comprehensive API endpoints
- [x] React frontend with modern UI components (shadcn/ui)
- [x] MongoDB database integration
- [x] JWT-based authentication system
- [x] Role-based access control (Patient/Clinician)
- [x] Mobile-responsive design

### ✅ Document Management
- [x] PDF upload and storage (MinIO integration)
- [x] OCR text extraction with fallback
- [x] Medical entity extraction
- [x] Vector database storage (ChromaDB)
- [x] Document download functionality

### ✅ AI-Powered Analysis
- [x] RAG (Retrieval Augmented Generation) system
- [x] Local LLM support (Ollama) with OpenAI fallback
- [x] Medical document analysis
- [x] Context-aware query responses
- [x] Confidence scoring

### ✅ Wearable Data Integration
- [x] Google Fit OAuth integration
- [x] Fitbit OAuth integration
- [x] Health metrics visualization
- [x] Data synchronization

### ✅ Report Generation
- [x] PDF report generation (ReportLab)
- [x] Health metrics visualization
- [x] Comprehensive and monthly reports
- [x] Automated chart generation

### ✅ Security & Compliance
- [x] HIPAA-compliant data handling
- [x] Encrypted data storage
- [x] Secure API endpoints
- [x] Environment-based configuration

## 🛠 Technology Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB with Motor (async)
- **Authentication**: JWT with bcrypt
- **File Storage**: MinIO (self-hosted S3-compatible)
- **Vector Database**: ChromaDB for RAG
- **AI/ML**: Ollama (local LLM) + OpenAI fallback
- **PDF Processing**: PyPDF2, pdf2image, pytesseract
- **Medical Standards**: FHIR resources
- **Report Generation**: ReportLab, matplotlib

### Frontend
- **Framework**: React 19 with modern hooks
- **UI Library**: shadcn/ui (Radix UI + Tailwind CSS)
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom healthcare theme

### Infrastructure
- **Containerization**: Docker support
- **File Storage**: MinIO (no AWS dependencies)
- **Environment**: Python-dotenv for configuration
- **Testing**: Comprehensive API testing suite

## 📋 Prerequisites

- Python 3.9+
- Node.js 18+
- MongoDB (local or cloud)
- MinIO server (for file storage)
- Ollama (optional, for local LLM)

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd Patient-Clinician-Medical-RAG-main
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your configuration
```

### 4. Start Services

#### Start MinIO (File Storage)
```bash
# Using Docker
docker run -p 9000:9000 -p 9001:9001 \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin" \
  minio/minio server /data --console-address ":9001"
```

#### Start MongoDB
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### Start Ollama (Optional - for local LLM)
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a medical-friendly model
ollama pull llama3.1:8b
```

#### Start Backend
```bash
cd backend
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

#### Start Frontend
```bash
cd frontend
npm start
```

### 5. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **MinIO Console**: http://localhost:9001

## 🔧 Configuration

### Backend Environment Variables (.env)
```env
# Database
MONGO_URL=mongodb://localhost:27017
DB_NAME=healthsync_platform

# Security
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_ALGORITHM=HS256

# MinIO Configuration
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=health-documents

# Google Fit Integration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/wearable/google/callback

# Fitbit Integration
FITBIT_CLIENT_ID=your-fitbit-client-id
FITBIT_CLIENT_SECRET=your-fitbit-client-secret
FITBIT_REDIRECT_URI=http://localhost:8000/api/wearable/fitbit/callback

# OpenAI (Optional - fallback for local LLM)
OPENAI_API_KEY=your-openai-api-key-if-needed
```

### Frontend Environment Variables (.env.local)
```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- **Desktop**: Full-featured dashboard with multi-column layouts
- **Tablet**: Adaptive layouts with collapsible sidebars
- **Mobile**: Touch-optimized interface with bottom navigation
- **PWA Ready**: Can be installed as a mobile app

### Mobile Features
- Touch-friendly buttons and inputs
- Swipe gestures for navigation
- Optimized file upload for mobile cameras
- Responsive data tables and charts
- Mobile-first authentication flow

## 🧪 Testing

### Backend API Testing
```bash
cd backend
python backend_test.py
```

### Frontend Testing
```bash
cd frontend
npm test
```

### Manual Testing Checklist
- [ ] User registration (Patient & Clinician)
- [ ] User authentication and JWT validation
- [ ] PDF document upload and processing
- [ ] Medical document analysis queries
- [ ] Wearable device connection (Google Fit/Fitbit)
- [ ] Health data visualization
- [ ] PDF report generation and download
- [ ] Mobile responsiveness across devices

## 🔒 Security Features

### Data Protection
- **Encryption**: All data encrypted at rest and in transit
- **Authentication**: JWT-based with secure password hashing
- **Authorization**: Role-based access control
- **HIPAA Compliance**: Healthcare data handling standards
- **API Security**: Rate limiting and input validation

### Privacy Controls
- **Data Sovereignty**: Self-hosted storage (MinIO)
- **User Consent**: Explicit permissions for wearable data
- **Data Retention**: Configurable retention policies
- **Audit Logging**: Comprehensive access logging

## 🏥 Medical Compliance

### FHIR Integration
- Patient resource management
- Document reference standards
- Observation data structures
- Practitioner role definitions

### Healthcare Standards
- **HL7 FHIR R4**: Modern healthcare interoperability
- **HIPAA**: Privacy and security compliance
- **Medical Terminology**: SNOMED CT support ready
- **Clinical Decision Support**: AI-powered insights

## 🚀 Deployment

### Production Deployment
1. **Environment Setup**: Configure production environment variables
2. **Database**: Setup MongoDB cluster with authentication
3. **File Storage**: Deploy MinIO with proper security
4. **SSL/TLS**: Configure HTTPS for all endpoints
5. **Monitoring**: Setup logging and health checks
6. **Backup**: Implement automated backup strategies

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the API documentation at `/docs`
- Review the testing suite for examples

## 🔄 Recent Updates

### Latest Changes
- ✅ Fixed all dependency conflicts and version mismatches
- ✅ Implemented complete mobile responsiveness
- ✅ Added comprehensive error handling
- ✅ Enhanced security with proper JWT validation
- ✅ Integrated MinIO for self-hosted file storage
- ✅ Added Ollama support for local LLM processing
- ✅ Implemented FHIR-compliant data structures
- ✅ Added comprehensive testing suite
- ✅ Enhanced UI/UX with modern design patterns

### Next Steps
- [ ] Add Apple Health integration
- [ ] Implement advanced medical NLP
- [ ] Add real-time notifications
- [ ] Enhance reporting with more chart types
- [ ] Add multi-language support
- [ ] Implement advanced analytics dashboard

---

**Built with ❤️ for healthcare professionals and patients**