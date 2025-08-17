@@ .. @@
 # Configuration
 MONGO_URL = os.environ['MONGO_URL']
 DB_NAME = os.environ.get('DB_NAME', 'healthsync_platform')
 JWT_SECRET = os.environ.get('JWT_SECRET', 'healthsync-jwt-secret-key-change-in-production-2024')
 JWT_ALGORITHM = "HS256"
 JWT_EXPIRATION_HOURS = 24
 
 # MinIO Configuration
 MINIO_ENDPOINT = os.environ.get('MINIO_ENDPOINT', 'localhost:9000')
 MINIO_ACCESS_KEY = os.environ.get('MINIO_ACCESS_KEY', 'minioadmin')
 MINIO_SECRET_KEY = os.environ.get('MINIO_SECRET_KEY', 'minioadmin')
 MINIO_BUCKET = os.environ.get('MINIO_BUCKET', 'health-documents')
+MINIO_SECURE = os.environ.get('MINIO_SECURE', 'false').lower() == 'true'
 
 # Google Fit Configuration
 GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID')
 GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET')
 GOOGLE_REDIRECT_URI = os.environ.get('GOOGLE_REDIRECT_URI', 'http://localhost:8000/api/wearable/google/callback')
 
 # Fitbit Configuration
 FITBIT_CLIENT_ID = os.environ.get('FITBIT_CLIENT_ID')
 FITBIT_CLIENT_SECRET = os.environ.get('FITBIT_CLIENT_SECRET')
 FITBIT_REDIRECT_URI = os.environ.get('FITBIT_REDIRECT_URI', 'http://localhost:8000/api/wearable/fitbit/callback')
 
+# Ollama Configuration
+OLLAMA_BASE_URL = os.environ.get('OLLAMA_BASE_URL', 'http://localhost:11434')
+OLLAMA_MODEL = os.environ.get('OLLAMA_MODEL', 'llama3.1:8b')
+
+# OpenAI Configuration (fallback)
+OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
+
 # MongoDB connection
 client = AsyncIOMotorClient(MONGO_URL)
 db = client[DB_NAME]
 
 # Security
 pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
 security = HTTPBearer()
 
 # MinIO client
-minio_client = Minio(
-    MINIO_ENDPOINT,
-    access_key=MINIO_ACCESS_KEY,
-    secret_key=MINIO_SECRET_KEY,
-    secure=False  # Set to True for HTTPS
-)
+try:
+    minio_client = Minio(
+        MINIO_ENDPOINT,
+        access_key=MINIO_ACCESS_KEY,
+        secret_key=MINIO_SECRET_KEY,
+        secure=MINIO_SECURE
+    )
+    
+    # Create MinIO bucket if it doesn't exist
+    if not minio_client.bucket_exists(MINIO_BUCKET):
+        minio_client.make_bucket(MINIO_BUCKET)
+        logger.info(f"Created MinIO bucket: {MINIO_BUCKET}")
+except Exception as e:
+    logger.error(f"MinIO initialization error: {e}")
+    minio_client = None
 
-# Create MinIO bucket if it doesn't exist
-try:
-    if not minio_client.bucket_exists(MINIO_BUCKET):
-        minio_client.make_bucket(MINIO_BUCKET)
-except S3Error as e:
-    logging.error(f"MinIO bucket creation error: {e}")
-
 # Initialize ChromaDB for RAG
-chroma_client = chromadb.PersistentClient(path="./medical_vector_db")
 try:
+    chroma_client = chromadb.PersistentClient(path="./medical_vector_db")
     collection = chroma_client.get_collection("medical_documents")
-except:
+    logger.info("Connected to existing ChromaDB collection")
+except Exception:
     collection = chroma_client.create_collection("medical_documents")
+    logger.info("Created new ChromaDB collection")
 
 # Create the main app
 app = FastAPI(title="HealthSync - Patient-Clinician Health Data Platform", version="1.0.0")
@@ .. @@
 # Medical Analysis Service
 class MedicalAnalysisService:
     def __init__(self):
-        self.ollama_url = "http://localhost:11434"
+        self.ollama_url = OLLAMA_BASE_URL
+        self.ollama_model = OLLAMA_MODEL
+        self.openai_api_key = OPENAI_API_KEY
     
     async def analyze_query(self, query: str, document_ids: Optional[List[str]] = None) -> Dict[str, Any]:
         """Analyze medical query using RAG"""
         try:
             # Search for relevant context
             context_docs = self._search_similar_documents(query, document_ids)
             
             # Generate response using local LLM (Ollama) or fallback
             response = await self._generate_response(query, context_docs)
             
             return {
                 "success": True,
                 "response": response,
                 "confidence": 0.85,  # Placeholder
                 "sources": [doc["document_id"] for doc in context_docs]
             }
         except Exception as e:
             logger.error(f"Medical analysis failed: {e}")
             return {"success": False, "error": str(e)}
     
     def _search_similar_documents(self, query: str, document_ids: Optional[List[str]] = None, k: int = 3) -> List[Dict]:
         """Search for similar documents in vector store"""
         try:
             where_filter = {}
             if document_ids:
                 where_filter = {"document_id": {"$in": document_ids}}
             
             results = collection.query(
                 query_texts=[query],
                 n_results=k,
                 where=where_filter if where_filter else None,
                 include=['documents', 'metadatas']
             )
             
             formatted_results = []
             if results['documents'] and results['documents'][0]:
                 for i, (doc, metadata) in enumerate(zip(results['documents'][0], results['metadatas'][0])):
                     formatted_results.append({
                         'content': doc,
                         'document_id': metadata.get('document_id', 'unknown'),
                         'metadata': metadata
                     })
             
             return formatted_results
         except Exception as e:
             logger.error(f"Document search failed: {e}")
             return []
     
     async def _generate_response(self, query: str, context_docs: List[Dict]) -> str:
         """Generate response using LLM"""
         try:
-            # Try Ollama first
             context_text = "\n".join([doc['content'] for doc in context_docs[:3]])
             
             prompt = f"""You are a medical AI assistant. Based on the following medical documents, answer the query.
 
 Medical Context:
 {context_text}
 
 Query: {query}
 
 Please provide a helpful, accurate response based on the provided medical information. If the information is insufficient, say so clearly."""
 
-            # Try to use Ollama
+            # Try Ollama first
             try:
                 response = requests.post(
-                    f"{self.ollama_url}/api/generate",
+                    f"{self.ollama_url}/api/generate", 
                     json={
-                        "model": "llama3.1:8b",
+                        "model": self.ollama_model,
                         "prompt": prompt,
                         "stream": False,
                         "options": {"temperature": 0.1}
                     },
                     timeout=60
                 )
                 
                 if response.status_code == 200:
-                    return response.json().get("response", "Unable to generate response")
-            except:
-                pass
+                    ollama_response = response.json().get("response", "")
+                    if ollama_response.strip():
+                        return ollama_response
+                        
+                logger.warning("Ollama response was empty, trying OpenAI fallback")
+            except Exception as e:
+                logger.warning(f"Ollama request failed: {e}, trying OpenAI fallback")
+            
+            # Try OpenAI fallback
+            if self.openai_api_key:
+                try:
+                    import openai
+                    openai.api_key = self.openai_api_key
+                    
+                    response = openai.ChatCompletion.create(
+                        model="gpt-3.5-turbo",
+                        messages=[
+                            {"role": "system", "content": "You are a medical AI assistant. Provide helpful, accurate responses based on medical information."},
+                            {"role": "user", "content": prompt}
+                        ],
+                        max_tokens=500,
+                        temperature=0.1
+                    )
+                    
+                    return response.choices[0].message.content
+                except Exception as e:
+                    logger.warning(f"OpenAI fallback failed: {e}")
             
             # Fallback response
             return f"Based on the available medical documents, I found {len(context_docs)} relevant sources. However, I'm unable to provide a detailed analysis at this time. Please consult with a healthcare professional for proper medical advice."
             
         except Exception as e:
             logger.error(f"Response generation failed: {e}")
             return "I'm unable to analyze this query at the moment. Please try again later."
 
 # Wearable Data Service
@@ .. @@
 @api_router.post("/documents/upload")
 async def upload_document(
     background_tasks: BackgroundTasks,
     file: UploadFile = File(...),
     patient_id: Optional[str] = None,
     document_type: str = "medical_record",
     current_user: User = Depends(get_current_user)
 ):
+    if not minio_client:
+        raise HTTPException(status_code=500, detail="File storage service unavailable")
+        
     if not file.filename.lower().endswith('.pdf'):
         raise HTTPException(status_code=400, detail="Only PDF files are supported")
     
     document_id = str(uuid.uuid4())
     
     try:
         # Upload to MinIO
         file_content = await file.read()
         minio_key = f"documents/{document_id}/{file.filename}"
         
         minio_client.put_object(
             MINIO_BUCKET,
             minio_key,
             io.BytesIO(file_content),
             len(file_content),
             content_type=file.content_type
         )
         
         # Store document metadata
         document_data = {
             "document_id": document_id,
             "filename": file.filename,
             "file_size": len(file_content),
             "content_type": file.content_type,
             "minio_key": minio_key,
             "user_id": current_user.id,
             "patient_id": patient_id if patient_id else current_user.id,
             "document_type": document_type,
             "uploaded_at": datetime.utcnow(),
             "processing_status": "pending"
         }
         
         await db.documents.insert_one(document_data)
         
         # Process document in background
         background_tasks.add_task(process_document_background, document_id, file_content)
         
         return DocumentUpload(
             document_id=document_id,
             filename=file.filename,
             file_size=len(file_content),
             content_type=file.content_type,
             patient_id=patient_id,
             document_type=document_type,
             upload_status="uploaded"
         )
         
     except Exception as e:
         logger.error(f"Document upload failed: {e}")
         raise HTTPException(status_code=500, detail="Document upload failed")
 
 async def process_document_background(document_id: str, file_content: bytes):
     """Background task to process uploaded document"""
     try:
         # Update status
         await db.documents.update_one(
             {"document_id": document_id},
             {"$set": {"processing_status": "processing"}}
         )
         
         # Save to temporary file for processing
         with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
             temp_file.write(file_content)
             temp_path = temp_file.name
         
         # Process document
         result = await doc_processor.process_pdf(temp_path)
         
         if result["success"]:
             # Add to vector store
             document = await db.documents.find_one({"document_id": document_id})
             metadata = {
                 "document_id": document_id,
                 "filename": document["filename"],
                 "document_type": document["document_type"]
             }
             
             await doc_processor.add_to_vector_store(result["text"], document_id, metadata)
             
             # Update document with processing results
             await db.documents.update_one(
                 {"document_id": document_id},
                 {"$set": {
                     "processing_status": "completed",
                     "extracted_text": result["text"],
                     "medical_entities": result["entities"],
                     "page_count": result["page_count"],
                     "processed_at": datetime.utcnow()
                 }}
             )
         else:
             await db.documents.update_one(
                 {"document_id": document_id},
                 {"$set": {
                     "processing_status": "failed",
                     "error": result.get("error", "Unknown error")
                 }}
             )
         
         # Clean up temp file
         os.unlink(temp_path)
         
     except Exception as e:
         logger.error(f"Document processing failed: {e}")
         await db.documents.update_one(
             {"document_id": document_id},
             {"$set": {"processing_status": "failed", "error": str(e)}}
         )
 
 @api_router.get("/documents")
@@ .. @@
 @api_router.get("/documents/{document_id}/download")
 async def download_document(document_id: str, current_user: User = Depends(get_current_user)):
+    if not minio_client:
+        raise HTTPException(status_code=500, detail="File storage service unavailable")
+        
     document = await db.documents.find_one({"document_id": document_id, "user_id": current_user.id})
     if not document:
         raise HTTPException(status_code=404, detail="Document not found")
     
     try:
         # Get file from MinIO
         file_obj = minio_client.get_object(MINIO_BUCKET, document["minio_key"])
         
         def iterfile():
             yield from file_obj
         
         return StreamingResponse(
             iterfile(),
             media_type=document["content_type"],
             headers={"Content-Disposition": f"attachment; filename={document['filename']}"}
         )
     except Exception as e:
         logger.error(f"Document download failed: {e}")
         raise HTTPException(status_code=500, detail="Document download failed")
 
 # Medical analysis routes
@@ .. @@
 @api_router.get("/reports/{report_id}/download")
 async def download_report(report_id: str, current_user: User = Depends(get_current_user)):
     """Download generated report"""
+    if not minio_client:
+        raise HTTPException(status_code=500, detail="File storage service unavailable")
+        
     report = await db.reports.find_one({"report_id": report_id, "user_id": current_user.id})
     if not report:
         raise HTTPException(status_code=404, detail="Report not found")
     
     try:
         # Get file from MinIO
         file_obj = minio_client.get_object(MINIO_BUCKET, report["minio_key"])
         
         def iterfile():
             yield from file_obj
         
         return StreamingResponse(
             iterfile(),
             media_type="application/pdf",
             headers={"Content-Disposition": f"attachment; filename=health_report_{report['report_type']}.pdf"}
         )
     except Exception as e:
         logger.error(f"Report download failed: {e}")
         raise HTTPException(status_code=500, detail="Report download failed")
 
 # Health check
 @api_router.get("/health")
 async def health_check():
     """System health check"""
+    # Check service availability
+    services = {
+        "database": "connected",
+        "minio": "connected" if minio_client else "disconnected",
+        "vector_store": "connected" if collection else "disconnected"
+    }
+    
+    # Check Ollama availability
+    try:
+        response = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=5)
+        services["ollama"] = "connected" if response.status_code == 200 else "disconnected"
+    except:
+        services["ollama"] = "disconnected"
+    
     return {
         "status": "healthy",
         "timestamp": datetime.utcnow().isoformat(),
-        "services": {
-            "database": "connected",
-            "minio": "connected" if minio_client else "disconnected",
-            "vector_store": "connected" if collection else "disconnected"
-        }
+        "services": services,
+        "version": "1.0.0"
     }
 
 # Include router
 app.include_router(api_router)
 
 # CORS middleware
 app.add_middleware(
     CORSMiddleware,
     allow_credentials=True,
-    allow_origins=["*"],
+    allow_origins=os.environ.get('CORS_ORIGINS', 'http://localhost:3000').split(','),
     allow_methods=["*"],
     allow_headers=["*"],
 )
 
+# Add error handling middleware
+@app.exception_handler(Exception)
+async def global_exception_handler(request, exc):
+    logger.error(f"Global exception: {exc}")
+    return {"error": "Internal server error", "detail": str(exc)}
+
 # Startup event
 @app.on_event("startup")
 async def startup_event():
+    logger.info("Starting HealthSync Platform API...")
+    
+    # Verify critical services
+    if not minio_client:
+        logger.warning("MinIO client not available - file operations will fail")
+    
+    if not collection:
+        logger.warning("ChromaDB collection not available - RAG operations will fail")
+    
     logger.info("HealthSync Platform API started successfully")
 
 @app.on_event("shutdown")
 async def shutdown_event():
     client.close()
     logger.info("HealthSync Platform API shutdown completed")
+
+# Root endpoint
+@app.get("/")
+async def root():
+    return {
+        "message": "HealthSync - Patient-Clinician Health Data Platform",
+        "version": "1.0.0",
+        "docs": "/docs",
+        "health": "/api/health"
+    }