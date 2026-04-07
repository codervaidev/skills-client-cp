# API Documentation: Course Full Data (V2)

**Endpoint**: `GET /user/course/getfull-v2/:courseId`  
**Description**: Retrieves the full course structure (chapters and modules) for an enrolled student. Access is strictly enforced.

---

## 🔐 Authentication
**Header**: `Authorization: Bearer <token>`  
**Requirement**: Valid Student JWT (`type 3`).

---

## 📥 Request Format
- **Method**: `GET`
- **Path Parameter**: `courseId` (Positive Integer)

---

## 📤 Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": 10,
    "title": "Discrete Mathematics",
    "isTaken": true,
    "maxModuleSerialProgress": 25,
    "chapters": [
      {
        "id": 101,
        "course_id": 10,
        "title": "Chapter 1: Logic",
        "serial": 1,
        "phase": 1,
        "is_free": false,
        "is_live": false,
        "allowed_unlock": true,
        "modules": [
          {
            "id": 1001,
            "chapter_id": 101,
            "title": "Module 1.1: Introduction",
            "description": "...",
            "serial": 1,
            "score": 10,
            "is_free": false,
            "is_live": false,
            "difficulty": "Easy",
            "metadata": {},
            "will_evaluated": null,
            "quiz_time_limit": null,
            "quiz_attempt_limit": null,
            "pdf_drive_link": null,
            "assignment_question_doc_url": null,
            "assignment_question_doc_type": null,
            "data": {
              "category": "VIDEO",
              "videoHost": "youtube",
              "videoUrl": "..."
            }
          }
        ]
      }
    ]
  },
  "meta": {
    "timestamp": "2026-04-06T17:35:19.123Z"
  }
}
```

---

## ❌ Error Responses

### 401 Unauthorized
Returned when the token is missing, expired, or invalid.
```json
{
  "success": false,
  "version": "v2",
  "error": {
    "code": "AUTH_REQUIRED",
    "message": "Authentication required"
  },
  "meta": {
    "timestamp": "2026-04-06T17:35:19.123Z"
  }
}
```

### 403 Forbidden
Returned when the user is authenticated but not enrolled in the course, or is not a student account.
```json
{
  "success": false,
  "version": "v2",
  "error": {
    "code": "COURSE_ACCESS_DENIED",
    "message": "Access denied"
  },
  "meta": {
    "timestamp": "2026-04-06T17:35:19.123Z"
  }
}
```

### 404 Not Found
Returned when the `courseId` does not exist in the database.
```json
{
  "success": false,
  "version": "v2",
  "error": {
    "code": "COURSE_NOT_FOUND",
    "message": "Course not found"
  },
  "meta": {
    "timestamp": "2026-04-06T17:35:19.123Z"
  }
}
```

### 400 Bad Request
Returned when the `courseId` is not a positive integer.
```json
{
  "success": false,
  "version": "v2",
  "error": {
    "code": "INVALID_PATH_PARAM",
    "message": "Course ID must be a positive integer"
  },
  "meta": {
    "timestamp": "2026-04-06T17:35:19.123Z"
  }
}
```
