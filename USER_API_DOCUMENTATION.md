# 📖 Book App - User API & Access Control Documentation

Welcome to the **Book App REST API Documentation**. This guide provides complete details for all user endpoints, input parameter specifications, required fields, authorization headers, plan-based access controls, and sample JSON request & response payloads.

---

## 🚀 Base URL & Server Info
- **Server Host**: `http://localhost:5001`
- **User API Base URL**: `http://localhost:5001/api/user`
- **Admin API Base URL**: `http://localhost:5001/api/admin`
- **Static File Uploads**: `http://localhost:5001/uploads/<filename>`

---

## 🔑 Authentication & Headers

Protected endpoints require a standard JSON Web Token (JWT) sent in the HTTP Request Header:

```http
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

---

## 🛡️ Subscription Plan-Based Access Control

Features and entity limits are governed by the user's active subscription plan (`Free Plan`, `Basic Plan`, `Pro Enterprise Plan`).

| Feature / Limit | Free Plan | Basic Plan | Pro Plan |
| :--- | :--- | :--- | :--- |
| **Max Event Posts** | 5 Posts | 50 Posts | Unlimited (-1) |
| **Max Notes/Events** | 10 Notes | 100 Notes | Unlimited (-1) |
| **Text / Location Details** | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| **Checklist / Tasks** | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| **Audio Post Details** | ❌ Restricted (403) | ✅ Allowed | ✅ Allowed |
| **Appointments Manager** | ❌ Restricted (403) | ✅ Allowed | ✅ Allowed |
| **Drawing Canvas Details** | ❌ Restricted (403) | ❌ Restricted (403) | ✅ Allowed |

If a user on a restricted plan attempts to access a locked feature, the API returns HTTP `403 Forbidden`:

```json
{
  "success": false,
  "error": "PLAN_RESTRICTION",
  "message": "Your current subscription plan (Free) does not support \"canAccessAppointments\". Please upgrade your plan to access this feature.",
  "requiredFeature": "canAccessAppointments"
}
```

---

## 📋 Table of Endpoints

1. [Authentication APIs](#1-authentication-apis)
2. [Profile & Settings APIs](#2-profile--settings-apis)
3. [Labels APIs](#3-labels-apis)
4. [Subscription Plan APIs](#4-subscription-plan-apis)
5. [Notes or Events APIs](#5-notes-or-events-apis)
6. [Event Posts & Favourites APIs](#6-event-posts--favourites-apis)
7. [Post Details APIs](#7-post-details-apis)
8. [Appointments APIs](#8-appointments-apis)
9. [Tasks APIs](#9-tasks-apis)
10. [Quick Notes/Events APIs](#10-quick-notesevents-apis)
11. [Feedback APIs](#11-feedback-apis)

---

## 1. Authentication APIs

### 1.1 Register User
- **Method**: `POST`
- **Endpoint**: `/api/user/auth/register`
- **Auth Required**: No

#### Request Fields:
| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `fullName` | String | Yes | User's full name |
| `email` | String | Yes | Unique email address |
| `mobile` | String | Yes | Unique 10-digit mobile number |
| `password` | String | Yes | Account password |

#### Sample Request Body:
```json
{
  "fullName": "John Doe",
  "email": "johndoe@example.com",
  "mobile": "9876543210",
  "password": "SecurePassword123"
}
```

#### Sample Response (`201 Created`):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "6aa3d876fb57bb4cc334d420",
    "fullName": "John Doe",
    "email": "johndoe@example.com",
    "mobile": "9876543210",
    "profileImage": "",
    "theme": "light",
    "language": "english",
    "subscription": {
      "planId": "free_plan",
      "planTitle": "Free Plan",
      "status": "active",
      "startDate": "2026-09-11T15:50:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 1.2 Login User
- **Method**: `POST`
- **Endpoint**: `/api/user/auth/login`
- **Auth Required**: No

#### Request Fields:
| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `loginId` | String | Yes | Registered Email OR Mobile Number |
| `password` | String | Yes | Password |

#### Sample Request Body:
```json
{
  "loginId": "johndoe@example.com",
  "password": "SecurePassword123"
}
```

#### Sample Response (`200 OK`):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "6aa3d876fb57bb4cc334d420",
    "fullName": "John Doe",
    "email": "johndoe@example.com",
    "mobile": "9876543210",
    "profileImage": "",
    "theme": "light",
    "language": "english",
    "subscription": {
      "planId": "free_plan",
      "planTitle": "Free Plan",
      "status": "active"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 1.3 Forgot Password
- **Method**: `POST`
- **Endpoint**: `/api/user/auth/forgot-password`
- **Auth Required**: No

#### Request Fields:
| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `email` | String | Yes | Registered email address |

#### Sample Request:
```json
{
  "email": "johndoe@example.com"
}
```

#### Sample Response (`200 OK`):
```json
{
  "success": true,
  "message": "Password reset OTP generated successfully",
  "data": {
    "email": "johndoe@example.com",
    "resetOtp": "849201",
    "note": "Use this OTP to reset your password via the Change Password endpoint"
  }
}
```

---

### 1.4 Change Password
- **Method**: `POST`
- **Endpoint**: `/api/user/auth/change-password`
- **Auth Required**: No / Optional

#### Request Fields:
| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `email` | String | Yes | Registered email |
| `newPassword` | String | Yes | New password |
| `oldPassword` | String | Optional | Current password if logged in |

#### Sample Request:
```json
{
  "email": "johndoe@example.com",
  "newPassword": "NewSecretPassword123"
}
```

#### Sample Response (`200 OK`):
```json
{
  "success": true,
  "message": "Password changed successfully. Please login with your new password."
}
```

---

### 1.5 Logout
- **Method**: `POST`
- **Endpoint**: `/api/user/auth/logout`
- **Auth Required**: Yes

#### Sample Response (`200 OK`):
```json
{
  "success": true,
  "message": "User logged out successfully"
}
```

---

## 2. Profile & Settings APIs

### 2.1 Get User Profile
- **Method**: `GET`
- **Endpoint**: `/api/user/profile`
- **Auth Required**: Yes

#### Sample Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "_id": "6aa3d876fb57bb4cc334d420",
    "fullName": "John Doe",
    "email": "johndoe@example.com",
    "mobile": "9876543210",
    "profileImage": "/uploads/profileImage-1726050000.png",
    "theme": "dark",
    "language": "english",
    "subscription": {
      "planId": "free_plan",
      "planTitle": "Free Plan",
      "status": "active"
    },
    "activePlanPermissions": {
      "maxPosts": 5,
      "maxNotes": 10,
      "canAccessAudio": false,
      "canAccessDrawing": false,
      "canAccessAppointments": false,
      "canAccessChecklist": true,
      "canAccessLocation": true
    }
  }
}
```

---

### 2.2 Update Profile & Avatar
- **Method**: `PUT`
- **Endpoint**: `/api/user/profile`
- **Auth Required**: Yes
- **Content-Type**: `multipart/form-data` or `application/json`

#### Request Fields:
| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `fullName` | String | Optional | Updated full name |
| `mobile` | String | Optional | Updated mobile number |
| `profileImage` | File | Optional | Upload new profile image file |

#### Sample Response (`200 OK`):
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "6aa3d876fb57bb4cc334d420",
    "fullName": "Johnathan Doe",
    "mobile": "9876543210",
    "profileImage": "/uploads/profileImage-1726051234.jpg"
  }
}
```

---

### 2.3 Update Theme (Dark / Light)
- **Method**: `PATCH`
- **Endpoint**: `/api/user/profile/theme`
- **Auth Required**: Yes

#### Request Fields:
| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `theme` | String | Yes | `"light"` or `"dark"` |

#### Sample Request:
```json
{
  "theme": "dark"
}
```

#### Sample Response (`200 OK`):
```json
{
  "success": true,
  "message": "Theme updated to dark",
  "data": {
    "theme": "dark"
  }
}
```

---

### 2.4 Update Language Preference
- **Method**: `PATCH`
- **Endpoint**: `/api/user/profile/language`
- **Auth Required**: Yes

#### Request Fields:
| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `language` | String | Yes | `"english"`, `"hindi"`, or `"gujarati"` |

#### Sample Request:
```json
{
  "language": "gujarati"
}
```

#### Sample Response (`200 OK`):
```json
{
  "success": true,
  "message": "Language updated to gujarati",
  "data": {
    "language": "gujarati"
  }
}
```

---

## 3. Labels APIs

### 3.1 Get All User Labels
- **Method**: `GET`
- **Endpoint**: `/api/user/labels`
- **Auth Required**: Yes

#### Sample Response (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "_id": "6aa3d876fb57bb4cc334d421",
      "userId": "6aa3d876fb57bb4cc334d420",
      "title": "Work Books",
      "color": "#3B82F6",
      "createdAt": "2026-09-11T15:52:00.000Z"
    }
  ]
}
```

---

### 3.2 Create Label
- **Method**: `POST`
- **Endpoint**: `/api/user/labels`
- **Auth Required**: Yes

#### Request Fields:
| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `title` | String | Yes | Label Title |
| `color` | String | Optional | Color hex code (Default: `#3B82F6`) |

#### Sample Request Body:
```json
{
  "title": "Personal Favorites",
  "color": "#10B981"
}
```

#### Sample Response (`201 Created`):
```json
{
  "success": true,
  "message": "Label created successfully",
  "data": {
    "_id": "6aa3d876fb57bb4cc334d422",
    "title": "Personal Favorites",
    "color": "#10B981"
  }
}
```

---

### 3.3 Update & Delete Label
- **Update**: `PUT /api/user/labels/:id`
- **Delete**: `DELETE /api/user/labels/:id`

---

## 4. Subscription Plan APIs

### 4.1 Get Available Subscription Plans
- **Method**: `GET`
- **Endpoint**: `/api/user/subscription/plans`
- **Auth Required**: No

#### Sample Response (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "_id": "free_plan",
      "title": "Free Plan",
      "price": 0,
      "duration": "Lifetime",
      "description": "Basic access to notes and posts.",
      "features": ["Up to 5 Posts", "Up to 10 Notes"],
      "permissions": {
        "maxPosts": 5,
        "maxNotes": 10,
        "canAccessAudio": false,
        "canAccessDrawing": false,
        "canAccessAppointments": false
      }
    },
    {
      "_id": "pro_plan",
      "title": "Pro Enterprise Plan",
      "price": 24.99,
      "duration": "Monthly",
      "description": "Unlimited access to all features.",
      "permissions": {
        "maxPosts": -1,
        "maxNotes": -1,
        "canAccessAudio": true,
        "canAccessDrawing": true,
        "canAccessAppointments": true
      }
    }
  ]
}
```

---

### 4.2 Subscribe / Upgrade Plan
- **Method**: `POST`
- **Endpoint**: `/api/user/subscription/subscribe`
- **Auth Required**: Yes

#### Request Fields:
| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `planId` | String | Yes | ID of target plan (e.g. `"pro_plan"`) |

#### Sample Request Body:
```json
{
  "planId": "pro_plan"
}
```

#### Sample Response (`200 OK`):
```json
{
  "success": true,
  "message": "Successfully subscribed to Pro Enterprise Plan",
  "data": {
    "subscription": {
      "planId": "pro_plan",
      "planTitle": "Pro Enterprise Plan",
      "status": "active",
      "startDate": "2026-09-11T15:53:00.000Z"
    }
  }
}
```

---

## 5. Notes or Events APIs

### 5.1 Get User Notes or Events
- **Method**: `GET`
- **Endpoint**: `/api/user/notes`
- **Auth Required**: Yes
- **Query Params**: `?type=note` or `?type=event` or `?tag=Reading`

#### Sample Response (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "_id": "6aa3d876fb57bb4cc334d425",
      "title": "Clean Code Summary",
      "tag": "Programming",
      "color": "#60A5FA",
      "type": "note",
      "content": "Key takeaways on refactoring and SOLID principles.",
      "createdAt": "2026-09-11T15:53:00.000Z"
    }
  ]
}
```

---

### 5.2 Create Note or Event
- **Method**: `POST`
- **Endpoint**: `/api/user/notes`
- **Auth Required**: Yes

#### Request Fields:
| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `title` | String | Yes | Note/Event Title |
| `tag` | String | Optional | Note Tag (Default: `"General"`) |
| `color` | String | Optional | Hex color (Default: `#60A5FA`) |
| `type` | String | Optional | `"note"` or `"event"` |
| `content` | String | Optional | Body text |

#### Sample Request Body:
```json
{
  "title": "Book Launch Event",
  "tag": "Events",
  "color": "#F59E0B",
  "type": "event",
  "content": "Attending technical book launch."
}
```

---

## 6. Event Posts & Favourites APIs

### 6.1 Get Event Posts
- **Method**: `GET`
- **Endpoint**: `/api/user/posts`
- **Auth Required**: Yes
- **Query Params**: `?favOnly=true` or `?tag=Tech`

---

### 6.2 Create Event Post
- **Method**: `POST`
- **Endpoint**: `/api/user/posts`
- **Auth Required**: Yes
- **Content-Type**: `multipart/form-data` or `application/json`

#### Request Fields:
| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `postTitle` | String | Yes | Post Title |
| `postImage` | File / URL | Optional | Image file or URL |
| `favPost` | Boolean | Optional | Toggle favourite (Default: `false`) |
| `postTag` | String | Optional | Tag name (Default: `"General"`) |

#### Sample Response (`201 Created`):
```json
{
  "success": true,
  "message": "Event post created successfully",
  "data": {
    "_id": "6aa3d876fb57bb4cc334d430",
    "postTitle": "Design Patterns Chapter 1",
    "postImage": "/uploads/postImage-1726055555.png",
    "favPost": true,
    "postTag": "Architecture"
  }
}
```

---

### 6.3 Toggle Favourite Post
- **Method**: `PATCH`
- **Endpoint**: `/api/user/posts/:id/favourite`
- **Auth Required**: Yes

#### Sample Response (`200 OK`):
```json
{
  "success": true,
  "message": "Post added to favourites",
  "data": {
    "_id": "6aa3d876fb57bb4cc334d430",
    "favPost": true
  }
}
```

---

## 7. Post Details APIs

Supports 9 distinct post detail types: `Text`, `Location`, `Images`, `Audio`, `Documents`, `CheckList`, `Appointment`, `Contact`, `Drawing`.

### 7.1 Add Post Detail Item
- **Method**: `POST`
- **Endpoint**: `/api/user/posts/:postId/details`
- **Auth Required**: Yes

#### Request Fields:
| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `postDetailsTitle` | String | Yes | Post Detail Title |
| `postType` | String | Yes | Type (`"Text"`, `"Location"`, `"Images"`, `"Audio"`, `"Documents"`, `"CheckList"`, `"Appointment"`, `"Contact"`, `"Drawing"`) |
| `content` | Object | Yes | Data payload corresponding to `postType` |
| `files` | File[] | Conditional | For `Images` or `Documents`, send up to 10 files using this repeated multipart field. For Audio/Drawing, the first file is used. The dedicated `audio` (one file) and `documents` (up to 10 files) fields are also supported, as is legacy `file`. |
| `replaceImages` | Boolean | Optional | For `Images`, set `true` to discard existing image URLs before saving newly uploaded files. Default: `false` (append). |
| `replaceDocuments` | Boolean | Optional | For `Documents`, set `true` to discard existing document entries before saving newly uploaded files. Default: `false` (append). |

For file uploads, use `multipart/form-data`. Send `content` as a JSON string. An Images detail stores its image URLs in `content.images`.
Audio uploads are stored in `content.audioUrl`. Documents (PDF, Word, Excel, PowerPoint, or text) are stored in `content.documents`, including each file's URL, original name, MIME type, and size.

#### Audio: Create a Detail

Use `multipart/form-data`; do not send the audio file inside JSON. Send the file with the `audio` field (recommended) or the `files` field. Accepted audio formats are MP3, WAV, OGG, M4A, and AAC. The maximum file size is 10 MB.

```http
POST /api/user/posts/:postId/details
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

postDetailsTitle=Meeting recording
postType=Audio
audio=@meeting.mp3
content={"description":"Client discussion"}
```

The uploaded audio URL is returned in `content.audioUrl`:

```json
{
  "success": true,
  "data": {
    "postType": "Audio",
    "content": {
      "description": "Client discussion",
      "audioUrl": "/uploads/audio-1726055555.mp3"
    }
  }
}
```

#### Audio: Replace an Existing File

```http
PUT /api/user/posts/details/:detailId
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

audio=@updated-meeting.m4a
```

#### Documents: Create a Detail
```http
POST /api/user/posts/:postId/details
Content-Type: multipart/form-data

postDetailsTitle=Project files
postType=Documents
documents=@brief.pdf
documents=@budget.xlsx
content={"description":"Files shared by the client"}
```

#### Example: Create an Images Detail
```http
POST /api/user/posts/:postId/details
Content-Type: multipart/form-data

postDetailsTitle=Project reference images
postType=Images
files=@cover.png
files=@page-1.jpg
files=@page-2.webp
content={"caption":"Initial references"}
```

The created detail will contain:
```json
{
  "postType": "Images",
  "content": {
    "caption": "Initial references",
    "images": [
      "/uploads/files-1726055555.png",
      "/uploads/files-1726055556.jpg",
      "/uploads/files-1726055557.webp"
    ]
  }
}
```

#### Sample Request Body (Location Detail):
```json
{
  "postDetailsTitle": "Meeting Venue Location",
  "postType": "Location",
  "content": {
    "address": "123 Tech Avenue, San Francisco, CA",
    "latitude": 37.7749,
    "longitude": -122.4194
  }
}
```

#### Sample Request Body (Drawing Detail):
```json
{
  "postDetailsTitle": "Architecture Mindmap Sketch",
  "postType": "Drawing",
  "content": {
    "drawingDataUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  }
}
```

---

### 7.2 Update Post Detail Item
- **Method**: `PUT`
- **Endpoint**: `/api/user/posts/details/:detailId`
- **Auth Required**: Yes

Use `multipart/form-data` to update image, audio, or document details. Send one or more files under the repeated `files` field (maximum 10 files per request).

- By default, uploaded files are appended to `content.images`.
- Send `replaceImages=true` to replace the existing image list with the newly uploaded files.
- Send `content` as a JSON string when changing other image metadata or supplying image URLs.
- Document uploads append to `content.documents`; send `replaceDocuments=true` to replace the existing document list.

#### Example: Append Images
```http
PUT /api/user/posts/details/:detailId
Content-Type: multipart/form-data

files=@page-3.jpg
files=@page-4.jpg
```

#### Example: Replace Images
```http
PUT /api/user/posts/details/:detailId
Content-Type: multipart/form-data

replaceImages=true
files=@new-cover.png
files=@new-page.jpg
```

---

## 8. Appointments APIs

*(Requires active plan with `canAccessAppointments: true`)*

### 8.1 Create Appointment
- **Method**: `POST`
- **Endpoint**: `/api/user/appointments`
- **Auth Required**: Yes

#### Request Fields:
| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `appointmentTitle` | String | Yes | Appointment Title |
| `description` | String | Optional | Description / notes |
| `startDateTime` | String (ISO) | Yes | Start date & time |
| `endDateTime` | String (ISO) | Yes | End date & time |
| `notify` | Boolean | Optional | Enable notification reminder (Default: `true`) |

#### Sample Request Body:
```json
{
  "appointmentTitle": "Publisher Contract Review",
  "description": "Discuss royalty terms and distribution.",
  "startDateTime": "2026-10-05T14:00:00Z",
  "endDateTime": "2026-10-05T15:00:00Z",
  "notify": true
}
```

---

## 9. Tasks APIs

### 9.1 Create Task
- **Method**: `POST`
- **Endpoint**: `/api/user/tasks`
- **Auth Required**: Yes

#### Request Fields:
| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `taskTitle` | String | Yes | Task Title |
| `startDateTime` | String (ISO) | Yes | Start date & time |
| `endDateTime` | String (ISO) | Yes | End date & time |
| `notify` | Boolean | Optional | Enable reminder (Default: `true`) |

#### Sample Request Body:
```json
{
  "taskTitle": "Complete Reading Chapter 10",
  "startDateTime": "2026-09-15T09:00:00Z",
  "endDateTime": "2026-09-15T10:00:00Z",
  "notify": true
}
```

---

## 10. Quick Notes/Events APIs

### 10.1 Create Quick Note
- **Method**: `POST`
- **Endpoint**: `/api/user/quick-notes`
- **Auth Required**: Yes

#### Request Fields:
| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `title` | String | Yes | Quick Note Title |
| `noteTag` | String | Optional | Tag name (Default: `"Quick"`) |
| `noteColor` | String | Optional | Hex color (Default: `#F59E0B`) |

#### Sample Request Body:
```json
{
  "title": "Buy hardcover copy of Refactoring",
  "noteTag": "Shopping",
  "noteColor": "#EC4899"
}
```

---

## 11. Feedback APIs

### 11.1 Submit User Feedback
- **Method**: `POST`
- **Endpoint**: `/api/user/feedback`
- **Auth Required**: Yes

#### Request Fields:
| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `feedbackTitle` | String | Yes | Feedback Title |
| `description` | String | Optional | Detailed feedback or issue report |
| `rating` | Number | Optional | Rating score from `1` to `5` (Default: `5`) |

#### Sample Request Body:
```json
{
  "feedbackTitle": "Awesome UI & seamless offline note storage!",
  "description": "Really enjoying the subscription plan features and dark mode.",
  "rating": 5
}
```

#### Sample Response (`201 Created`):
```json
{
  "success": true,
  "message": "Feedback submitted successfully. Thank you for helping us improve!",
  "data": {
    "_id": "6aa3d876fb57bb4cc334d450",
    "feedbackTitle": "Awesome UI & seamless offline note storage!",
    "rating": 5,
    "status": "pending"
  }
}
```
