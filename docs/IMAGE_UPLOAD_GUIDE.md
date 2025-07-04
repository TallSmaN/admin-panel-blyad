# Руководство по работе с изображениями

## Как работает система загрузки изображений

### 1. Фронтенд (текущая реализация)
- Пользователь выбирает файл через `ImageUpload` компонент
- Файл валидируется (размер, тип, формат)
- Файл отправляется на бэкенд через `POST /api/images/upload`

### 2. Бэкенд (что нужно реализовать)

#### Эндпоинты для изображений:

\`\`\`typescript
// POST /api/images/upload
// Загрузка изображения
{
  file: File // multipart/form-data
}
// Ответ:
{
  success: true,
  data: {
    filename: "product_123456789.jpg", // уникальное имя файла
    url: "/api/images/product_123456789.jpg" // URL для доступа
  }
}

// GET /api/images/:filename
// Получение изображения
// Возвращает файл с правильными заголовками Content-Type

// POST /api/images/delete
// Удаление изображения
{
  filename: "product_123456789.jpg"
}
// Ответ:
{
  success: true
}
\`\`\`

### 3. Схема работы

1. **Загрузка:**
   \`\`\`
   Фронтенд → POST /api/images/upload → Бэкенд сохраняет файл → Возвращает filename
   \`\`\`

2. **Сохранение в БД:**
   \`\`\`
   В таблице products сохраняется только filename (не полный URL!)
   \`\`\`

3. **Отображение:**
   \`\`\`
   Фронтенд получает filename → buildImageUrl(filename) → GET /api/images/:filename
   \`\`\`

4. **Удаление:**
   \`\`\`
   При удалении товара → POST /api/images/delete → Бэкенд удаляет файл
   \`\`\`

### 4. Структура файлов на бэкенде

\`\`\`
/uploads/
  /products/
    product_1704067200000.jpg
    product_1704067201000.png
    product_1704067202000.webp
\`\`\`

### 5. Рекомендации для бэкенда

#### Безопасность:
- Проверять MIME-type файлов
- Ограничивать размер файлов (5MB)
- Генерировать уникальные имена файлов
- Проверять расширения файлов

#### Производительность:
- Сжимать изображения при загрузке
- Создавать thumbnails для предпросмотра
- Кэшировать статические файлы

#### Пример реализации (Node.js + Express):

\`\`\`javascript
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/products');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `product_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Неподдерживаемый тип файла'));
    }
  }
});

// POST /api/images/upload
app.post('/api/images/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'Файл не загружен' });
  }

  res.json({
    success: true,
    data: {
      filename: req.file.filename,
      url: `/api/images/${req.file.filename}`
    }
  });
});

// GET /api/images/:filename
app.get('/api/images/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../uploads/products', filename);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Файл не найден' });
  }
  
  res.sendFile(filePath);
});

// POST /api/images/delete
app.post('/api/images/delete', (req, res) => {
  const { filename } = req.body;
  const filePath = path.join(__dirname, '../uploads/products', filename);
  
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  
  res.json({ success: true });
});
\`\`\`

### 6. Переключение на реальный API

В файле `services/image-service.ts` измените:
\`\`\`typescript
private USE_API = true // Включить реальный API
\`\`\`

В файле `services/data-service.ts` измените:
\`\`\`typescript
private USE_API = true // Включить реальный API
