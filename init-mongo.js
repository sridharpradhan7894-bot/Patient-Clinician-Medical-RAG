// MongoDB initialization script
db = db.getSiblingDB('healthsync_platform');

// Create collections
db.createCollection('users');
db.createCollection('documents');
db.createCollection('analyses');
db.createCollection('reports');
db.createCollection('wearable_tokens');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "id": 1 }, { unique: true });
db.users.createIndex({ "role": 1 });

db.documents.createIndex({ "document_id": 1 }, { unique: true });
db.documents.createIndex({ "user_id": 1 });
db.documents.createIndex({ "patient_id": 1 });
db.documents.createIndex({ "processing_status": 1 });
db.documents.createIndex({ "uploaded_at": -1 });

db.analyses.createIndex({ "analysis_id": 1 }, { unique: true });
db.analyses.createIndex({ "user_id": 1 });
db.analyses.createIndex({ "created_at": -1 });

db.reports.createIndex({ "report_id": 1 }, { unique: true });
db.reports.createIndex({ "user_id": 1 });
db.reports.createIndex({ "generated_at": -1 });

db.wearable_tokens.createIndex({ "user_id": 1 });
db.wearable_tokens.createIndex({ "platform": 1 });

print('Database initialized successfully');