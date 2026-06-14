
const jsonServer = require('json-server');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const pastaAssets = path.join(__dirname, 'public', 'assets');
if (!fs.existsSync(pastaAssets)) {
    fs.mkdirSync(pastaAssets, { recursive: true });
}
console.log('📁 Imagens em:', pastaAssets);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, pastaAssets),
    filename: (req, file, cb) => {
        const nome = Date.now() + '-' + file.originalname.replace(/\s/g, '_');
        cb(null, nome);
    }
});

const upload = multer({ storage });

server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

server.post('/upload', upload.single('imagem'), (req, res) => {
    if (!req.file) return res.status(400).json({ erro: 'Nenhum arquivo enviado.' });
    console.log('✅ Salvo:', req.file.filename);
    res.json({ filename: req.file.filename });
});

server.use(middlewares);
server.use(router);

server.listen(3000, () => console.log('✅ JSON Server em http://localhost:3000'));