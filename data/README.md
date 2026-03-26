# Data - Nội dung tùy chỉnh

Các file Markdown (YAML frontmatter) trong thư mục này điều khiển nội dung hiển thị trên landing page.

## intro.md
- **workStatus**: `open_to_work` hoặc `current_working` — badge dưới ảnh profile
- **profileImage**: URL ảnh
- **statusLabels**: nhãn EN/VI cho từng trạng thái
- **en** / **vi**: `badge`, `headlineLine1`, `headlineLine2`, `description`, `ctaProjects`, `estYear`, `estPrefix`

## skills.md, projects.md, experience.md, contact.md
Mỗi file có hai khối **`en:`** và **`vi:`** cùng cấu trúc — nội dung hiển thị theo ngôn ngữ đã chọn.

## skills.md (chi tiết)
- **title, subtitle**: Tiêu đề section
- **categories**: Mảng các nhóm kỹ năng
  - `id`: Định danh (programming, frameworks, devops, persistence, architecture)
  - `title`: Tên nhóm
  - `icon`: Material symbol name (code, layers, cloud, database, architecture)
  - `colSpan`: 2 cho nhóm rộng (Programming)
  - `borderLeft`: true cho viền trái primary
  - `fullWidth`: true cho nhóm Architecture (full row)
  - `borderTop`: true cho viền trên
  - `items`: Mảng string hoặc `{label, tag}` cho Architecture

## projects.md
- **title, subtitle, count**: Tiêu đề và số dự án
- **projects**: Mảng dự án
  - `title, objective, badge, icon, role`
  - `tech`: Mảng công nghệ
  - `highlights`: Mảng điểm nổi bật
  - `links`: (tùy chọn) GitHub links
    - `frontend`: Link repo frontend
    - `backend`: Link repo backend

## experience.md
- **title, subtitle**: Tiêu đề section
- **experiences**: Mảng kinh nghiệm
  - `title, period, company, icon`
  - `featured`: true = highlight
  - `bullets`: Mảng mô tả, dùng **text** cho in đậm
