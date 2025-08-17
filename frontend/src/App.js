@@ .. @@
 import { Progress } from "./components/ui/progress";
 import { AlertCircle, User, Stethoscope, FileText, Activity, Shield, Heart, Brain, Upload, Download, MessageCircle, BarChart3, FileUp, Smartphone, Clock, TrendingUp, Calendar, Settings } from "lucide-react";
 
-const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
+const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
 const API = `${BACKEND_URL}/api`;
 
 // Auth Context
@@ .. @@
         <div className="mb-8">
           <h2 className="text-3xl font-bold text-gray-900 mb-2">
             Welcome back, {user.full_name}
           </h2>
           <p className="text-gray-600">
             Manage your health data and get AI-powered insights
           </p>
         </div>
 
         {/* Stats Cards */}
-        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
+        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
           <Card className="border-l-4 border-l-blue-500">
-            <CardContent className="p-6">
+            <CardContent className="p-4 sm:p-6">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm text-gray-600 mb-1">Documents</p>
-                  <p className="text-2xl font-bold">{dashboardData.stats?.total_documents || 0}</p>
+                  <p className="text-xl sm:text-2xl font-bold">{dashboardData.stats?.total_documents || 0}</p>
                 </div>
-                <FileText className="w-8 h-8 text-blue-500" />
+                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
               </div>
             </CardContent>
           </Card>
 
           <Card className="border-l-4 border-l-green-500">
-            <CardContent className="p-6">
+            <CardContent className="p-4 sm:p-6">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm text-gray-600 mb-1">Analyses</p>
-                  <p className="text-2xl font-bold">{dashboardData.stats?.total_analyses || 0}</p>
+                  <p className="text-xl sm:text-2xl font-bold">{dashboardData.stats?.total_analyses || 0}</p>
                 </div>
-                <Brain className="w-8 h-8 text-green-500" />
+                <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
               </div>
             </CardContent>
           </Card>
 
           <Card className="border-l-4 border-l-purple-500">
-            <CardContent className="p-6">
+            <CardContent className="p-4 sm:p-6">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm text-gray-600 mb-1">Wearables</p>
-                  <p className="text-2xl font-bold">{dashboardData.stats?.wearable_connected ? '1' : '0'}</p>
+                  <p className="text-xl sm:text-2xl font-bold">{dashboardData.stats?.wearable_connected ? '1' : '0'}</p>
                 </div>
-                <Smartphone className="w-8 h-8 text-purple-500" />
+                <Smartphone className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
               </div>
             </CardContent>
           </Card>
@@ .. @@
 
         {/* Main Content Tabs */}
         <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
-          <TabsList className="grid w-full grid-cols-6">
+          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 gap-1">
             <TabsTrigger value="overview">Overview</TabsTrigger>
             <TabsTrigger value="documents">Documents</TabsTrigger>
             <TabsTrigger value="analysis">Analysis</TabsTrigger>
@@ .. @@
 // Overview Tab Component
 const OverviewTab = ({ dashboardData }) => {
   return (
-    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
+    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
       <Card>
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
@@ .. @@
         <CardContent>
           {dashboardData.recent_documents?.length > 0 ? (
             <div className="space-y-3">
               {dashboardData.recent_documents.map((doc, index) => (
-                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
+                <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                   <div>
-                    <p className="font-medium text-sm">{doc.filename}</p>
-                    <p className="text-xs text-gray-500">
+                    <p className="font-medium text-xs sm:text-sm truncate max-w-[200px]">{doc.filename}</p>
+                    <p className="text-xs text-gray-500 mt-1">
                       {new Date(doc.uploaded_at).toLocaleDateString()}
                     </p>
                   </div>
-                  <Badge variant="outline">PDF</Badge>
+                  <Badge variant="outline" className="text-xs">PDF</Badge>
                 </div>
               ))}
             </div>
@@ .. @@
         <CardContent>
           {dashboardData.recent_analyses?.length > 0 ? (
             <div className="space-y-3">
               {dashboardData.recent_analyses.map((analysis, index) => (
-                <div key={index} className="p-3 bg-gray-50 rounded-lg">
-                  <p className="font-medium text-sm mb-1">{analysis.query}</p>
+                <div key={index} className="p-2 sm:p-3 bg-gray-50 rounded-lg">
+                  <p className="font-medium text-xs sm:text-sm mb-1 line-clamp-2">{analysis.query}</p>
                   <p className="text-xs text-gray-500">
                     {new Date(analysis.created_at).toLocaleDateString()}
                   </p>
@@ .. @@
         <CardContent>
           <form onSubmit={handleFileUpload} className="space-y-4">
-            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
-              <FileUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
+            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center">
+              <FileUp className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
               <div className="space-y-2">
                 <Label htmlFor="file-upload" className="cursor-pointer">
                   <span className="text-blue-600 hover:text-blue-700 font-medium">
@@ -1000,7 +1000,7 @@ const DocumentsTab = ({ token }) => {
                   className="hidden"
                 />
                 <p className="text-xs text-gray-500">PDF files only, max 10MB</p>
               </div>
             </div>
             
             {selectedFile && (
@@ .. @@
         <CardContent>
           {documents.length > 0 ? (
             <div className="space-y-3">
               {documents.map((doc) => (
-                <div key={doc.document_id} className="flex items-center justify-between p-4 border rounded-lg">
+                <div key={doc.document_id} className="flex items-center justify-between p-3 sm:p-4 border rounded-lg">
                   <div className="flex items-center gap-3">
-                    <FileText className="w-5 h-5 text-blue-500" />
+                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                     <div>
-                      <p className="font-medium">{doc.filename}</p>
+                      <p className="font-medium text-sm sm:text-base truncate max-w-[200px] sm:max-w-none">{doc.filename}</p>
                       <div className="flex items-center gap-2 text-xs text-gray-500">
                         <span>{(doc.file_size / 1024).toFixed(1)} KB</span>
                         <span>•</span>
@@ .. @@
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={() => handleDownload(doc.document_id, doc.filename)}
+                    className="flex-shrink-0"
                   >
-                    <Download className="w-4 h-4" />
+                    <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                   </Button>
                 </div>
               ))}
@@ .. @@
       {/* Data Visualization */}
-      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
+      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
         <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => fetchWearableData('steps')}>
-          <CardContent className="p-6 text-center">
-            <Activity className="w-8 h-8 text-blue-500 mx-auto mb-2" />
+          <CardContent className="p-4 sm:p-6 text-center">
+            <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 mx-auto mb-2" />
             <h3 className="font-medium">Steps</h3>
-            <p className="text-2xl font-bold text-blue-600">8,500</p>
+            <p className="text-xl sm:text-2xl font-bold text-blue-600">8,500</p>
             <p className="text-xs text-gray-500">Daily average</p>
           </CardContent>
         </Card>
 
         <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => fetchWearableData('heart_rate')}>
-          <CardContent className="p-6 text-center">
-            <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
+          <CardContent className="p-4 sm:p-6 text-center">
+            <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 mx-auto mb-2" />
             <h3 className="font-medium">Heart Rate</h3>
-            <p className="text-2xl font-bold text-red-600">72</p>
+            <p className="text-xl sm:text-2xl font-bold text-red-600">72</p>
             <p className="text-xs text-gray-500">BPM average</p>
           </CardContent>
         </Card>
 
         <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => fetchWearableData('sleep')}>
-          <CardContent className="p-6 text-center">
-            <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
+          <CardContent className="p-4 sm:p-6 text-center">
+            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 mx-auto mb-2" />
             <h3 className="font-medium">Sleep</h3>
-            <p className="text-2xl font-bold text-purple-600">7.2</p>
+            <p className="text-xl sm:text-2xl font-bold text-purple-600">7.2</p>
             <p className="text-xs text-gray-500">Hours average</p>
           </CardContent>
         </Card>
@@ .. @@
         <CardContent>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
-            <div className="p-6 border rounded-lg text-center">
-              <TrendingUp className="w-12 h-12 text-blue-500 mx-auto mb-4" />
+            <div className="p-4 sm:p-6 border rounded-lg text-center">
+              <TrendingUp className="w-8 h-8 sm:w-12 sm:h-12 text-blue-500 mx-auto mb-4" />
               <h3 className="font-medium mb-2">Comprehensive Report</h3>
-              <p className="text-sm text-gray-600 mb-4">
+              <p className="text-xs sm:text-sm text-gray-600 mb-4">
                 Complete health overview with all metrics and trends
               </p>
               <Button 
@@ -1300,11 +1300,11 @@ const ReportsTab = ({ token }) => {
               </Button>
             </div>
 
-            <div className="p-6 border rounded-lg text-center">
-              <Calendar className="w-12 h-12 text-green-500 mx-auto mb-4" />
+            <div className="p-4 sm:p-6 border rounded-lg text-center">
+              <Calendar className="w-8 h-8 sm:w-12 sm:h-12 text-green-500 mx-auto mb-4" />
               <h3 className="font-medium mb-2">Monthly Summary</h3>
-              <p className="text-sm text-gray-600 mb-4">
+              <p className="text-xs sm:text-sm text-gray-600 mb-4">
                 Monthly health metrics and activity summary
               </p>
               <Button 
@@ .. @@
         <CardContent>
           <div className="space-y-4">
-            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
+            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                 <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                 <p className="text-gray-900">{user.full_name}</p>
@@ .. @@
         <CardContent>
           <div className="space-y-4">
-            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
+            <div className="flex items-center justify-between p-3 sm:p-4 bg-green-50 rounded-lg">
               <div className="flex items-center gap-3">
-                <Shield className="w-5 h-5 text-green-600" />
+                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                 <div>
-                  <p className="font-medium text-green-900">Data Encryption</p>
-                  <p className="text-sm text-green-700">Your data is encrypted at rest and in transit</p>
+                  <p className="font-medium text-green-900 text-sm sm:text-base">Data Encryption</p>
+                  <p className="text-xs sm:text-sm text-green-700">Your data is encrypted at rest and in transit</p>
                 </div>
               </div>
               <Badge variant="default" className="bg-green-600">Active</Badge>
             </div>
             
-            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
+            <div className="flex items-center justify-between p-3 sm:p-4 bg-blue-50 rounded-lg">
               <div className="flex items-center gap-3">
-                <Heart className="w-5 h-5 text-blue-600" />
+                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                 <div>
-                  <p className="font-medium text-blue-900">HIPAA Compliant</p>
-                  <p className="text-sm text-blue-700">Platform follows healthcare privacy standards</p>
+                  <p className="font-medium text-blue-900 text-sm sm:text-base">HIPAA Compliant</p>
+                  <p className="text-xs sm:text-sm text-blue-700">Platform follows healthcare privacy standards</p>
                 </div>
               </div>
               <Badge variant="default" className="bg-blue-600">Compliant</Badge>