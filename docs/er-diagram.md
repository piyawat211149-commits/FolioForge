# FolioForge — ER Diagram

เปิดดูแบบ interactive ได้ที่ [mermaid.live](https://mermaid.live) — copy โค้ดด้านล่างไปวาง

```mermaid
erDiagram
    USER {
        string id PK "cuid()"
        string username UK "ชื่อผู้ใช้ (unique)"
        string email UK "อีเมล (unique)"
        datetime emailVerified "วันที่ยืนยัน email"
        string passwordHash "รหัสผ่าน (bcrypt)"
        string name "ชื่อจริง"
        string bio "แนะนำตัว"
        string avatarUrl "รูปโปรไฟล์"
        string school "โรงเรียน/มหาวิทยาลัย"
        string gpa "เกรดเฉลี่ย"
        string contactLinks "ลิงก์ติดต่อ (JSON)"
        string theme "ธีมพอร์ต (default: minimal)"
        datetime createdAt "วันสมัคร"
        datetime updatedAt "อัพเดทล่าสุด"
    }

    PROJECT {
        string id PK "cuid()"
        string title "ชื่อโปรเจกต์"
        string description "รายละเอียด"
        string tags "แท็ก (JSON array)"
        string externalUrl "ลิงก์ภายนอก"
        boolean isPublic "เผยแพร่สาธารณะ?"
        datetime date "วันที่โปรเจกต์"
        string userId FK "เจ้าของโปรเจกต์"
        datetime createdAt "วันสร้าง"
        datetime updatedAt "อัพเดทล่าสุด"
    }

    PROJECT_FILE {
        string id PK "cuid()"
        string filename "ชื่อไฟล์"
        string url "URL (Vercel Blob)"
        string type "ประเภท (image/doc)"
        string projectId FK "โปรเจกต์ที่สังกัด"
    }

    PORTFOLIO_PAGE {
        string id PK "cuid()"
        string title "ชื่อหน้า"
        string slug "URL slug"
        string content "เนื้อหา (JSON)"
        int pageOrder "ลำดับหน้า"
        boolean isVisible "แสดงหน้านี้?"
        string userId FK "เจ้าของหน้า"
        datetime createdAt "วันสร้าง"
        datetime updatedAt "อัพเดทล่าสุด"
    }

    VERIFICATION_TOKEN {
        string id PK "cuid()"
        string token UK "token สำหรับยืนยัน"
        string userId FK "ผู้ใช้ที่ขอยืนยัน"
        datetime expiresAt "หมดอายุเมื่อ"
        datetime createdAt "วันสร้าง"
    }

    %% ── Relationships ──

    USER ||--o{ PROJECT : "สร้างโปรเจกต์"
    USER ||--o{ PORTFOLIO_PAGE : "มีหน้าพอร์ต"
    USER ||--o{ VERIFICATION_TOKEN : "ขอยืนยัน email"
    PROJECT ||--o{ PROJECT_FILE : "มีไฟล์แนบ"
```

## สรุปความสัมพันธ์

| จาก | ความสัมพันธ์ | ไป | คำอธิบาย |
|-----|-------------|-----|----------|
| **User** | 1 : N | **Project** | ผู้ใช้ 1 คนมีได้หลายโปรเจกต์ |
| **User** | 1 : N | **PortfolioPage** | ผู้ใช้ 1 คนมีได้หลายหน้าพอร์ต |
| **User** | 1 : N | **VerificationToken** | ผู้ใช้ 1 คนมีได้หลาย token ยืนยัน |
| **Project** | 1 : N | **ProjectFile** | โปรเจกต์ 1 อันมีได้หลายไฟล์ |

## Unique Constraints

- `User.username` — ชื่อผู้ใช้ห้ามซ้ำ
- `User.email` — อีเมลห้ามซ้ำ
- `VerificationToken.token` — token ห้ามซ้ำ
- `PortfolioPage (userId + slug)` — slug ห้ามซ้ำภายในผู้ใช้เดียวกัน

## Cascade Delete

ลบ User → ลบ Projects, PortfolioPages, VerificationTokens ทั้งหมดของ user นั้น
ลบ Project → ลบ ProjectFiles ทั้งหมดของ project นั้น
