# Image Upload Feature

## Overview
The application now supports uploading images directly from your computer, in addition to adding images via URL.

## Backend Setup

### 1. File Upload Controller
- **Location**: `spring-api/src/main/java/com/hotel/api/controller/FileUploadController.java`
- **Endpoint**: `POST /api/upload/image`
- **Features**:
  - Accepts image files (JPG, JPEG, PNG, GIF, WEBP)
  - Maximum file size: 5MB
  - Generates unique filenames using UUID
  - Stores files in `uploads/images/` directory
  - Returns image URL for storage in database

### 2. Configuration
- **File**: `application.properties`
- Settings:
  ```properties
  spring.servlet.multipart.enabled=true
  spring.servlet.multipart.max-file-size=5MB
  spring.servlet.multipart.max-request-size=5MB
  ```

### 3. Static File Serving
- **Location**: `spring-api/src/main/java/com/hotel/api/config/WebConfig.java`
- Serves uploaded images from `uploads/images/` directory
- Access via: `http://localhost:8080/uploads/images/{filename}`

## Frontend Features

### Upload Methods
Users can choose between two upload methods:

1. **Upload File** (Default)
   - Click or drag-and-drop to upload
   - Supports all common image formats
   - Visual file picker interface

2. **Image URL**
   - Paste URL from any website
   - Useful for images already hosted online

### Where to Upload Images

#### 1. Create Listing Page (`/host/listings/new`)
- Add an image when creating a new listing
- Optional - can be added later
- Supports both file upload and URL methods

#### 2. View Listing Page (`/host/listings/:id`)
- Add multiple images to existing listings
- Upload one image at a time
- Images appear immediately in the gallery

## Usage Examples

### From Computer (File Upload):
1. Navigate to a listing's detail page
2. Select "Upload File" tab
3. Click the upload area or drag a file
4. Click "Upload Image"
5. Image is uploaded and automatically added to the listing

### From URL:
1. Navigate to a listing's detail page
2. Select "Image URL" tab
3. Paste the image URL (e.g., from Unsplash, Imgur)
4. Click "Add"
5. Image is added to the listing

## Directory Structure
```
spring-api/
├── uploads/
│   └── images/               # Uploaded image files stored here
│       ├── uuid-1.jpg
│       ├── uuid-2.png
│       └── ...
└── src/
    └── main/
        └── java/
            └── com/hotel/api/
                ├── controller/
                │   └── FileUploadController.java
                └── config/
                    └── WebConfig.java
```

## Security Features
- Role-based access (only HOST and ADMIN can upload)
- File type validation (only image formats)
- File size limits (max 5MB)
- Unique filenames prevent overwrites
- Headers required: X-User-Id, X-User-Role

## API Endpoints

### Upload Image File
```http
POST /api/upload/image
Content-Type: multipart/form-data
X-User-Id: 1
X-User-Role: host

Body: FormData with 'file' field
```

**Response:**
```json
{
  "success": true,
  "imageUrl": "/uploads/images/uuid-filename.jpg",
  "filename": "uuid-filename.jpg",
  "originalFilename": "photo.jpg",
  "size": 245678
}
```

### Add Image to Listing
```http
POST /api/host/listings/{id}/images
Content-Type: application/json
X-User-Id: 1
X-User-Role: host

Body:
{
  "imageUrl": "http://localhost:8080/uploads/images/uuid-filename.jpg"
}
```

## Starting the Server

1. **Start RMI Server** (if not running):
   ```bash
   cd rmi-server
   java -cp "target/rmi-server-1.0-SNAPSHOT.jar;path/to/mysql-connector.jar" com.hotel.rmi.RMIServer
   ```

2. **Start Spring Boot API**:
   ```bash
   cd spring-api
   mvn spring-boot:run
   ```

3. **Start Frontend**:
   ```bash
   cd frontend
   npm start
   ```

## Testing

### Test File Upload:
1. Create a listing at http://localhost:5173/host/listings/new
2. Choose "Upload File" method
3. Select an image from your computer
4. Submit the form
5. Check the listing details page to see the uploaded image

### Test URL Upload:
1. Go to any listing's detail page
2. Choose "Image URL" method
3. Paste: `https://images.unsplash.com/photo-1566073771259-6a8506099945`
4. Click "Add"
5. Image should appear in the gallery

## Troubleshooting

### Images not appearing
- Check if `uploads/images/` directory exists in spring-api folder
- Verify Spring Boot is serving static files correctly
- Check browser console for 404 errors

### Upload fails
- Verify file size is under 5MB
- Check file format is supported (JPG, PNG, GIF, WEBP)
- Ensure user has HOST or ADMIN role
- Check Spring Boot logs for errors

### Permission denied
- Windows: Run terminal as administrator
- Create the `uploads/images/` directory manually if needed

## Notes
- Uploaded files are stored locally in the `uploads/images/` directory
- For production, consider using cloud storage (AWS S3, Azure Blob, etc.)
- The upload directory is not tracked by Git (add to .gitignore)
- Images are referenced in the database via full URL
