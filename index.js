const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }
});

db.connect(err => {
  if (err) {
    console.error('❌ Error conectando a MySQL:', err);
    return;
  }
  console.log('✅ Conectado a MySQL');
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡API funcionando!');
});

// 🔹 Login REAL desde BD
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = `
    SELECT * FROM users
    WHERE email = ? AND password = ?
  `;

  db.query(query, [username, password], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error en el servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = results[0];
    res.json({
      token: 'token-demo-123',
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });
  });
});

// 🔹 Endpoint perfil por email
app.get('/perfil/:email', (req, res) => {
  const { email } = req.params;

  const query = `
    SELECT id, nombre, email, rol
    FROM users
    WHERE email = ?
  `;

  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error obteniendo perfil' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(results[0]);
  });
});

// Iniciar servidor
app.listen(PORT, () =>
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`)
);

