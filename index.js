import express from 'express';
import bodyParser from 'body-parser';
import connection from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './views', '/index.html'));
    // res.send('<h1>Hola desde el back</h1>')
})

app.post('/clientes', async (req, res) => {
    let { name, email, pass } = await req.body;

    let query = 'INSERT INTO clientes (nombre, email, password) VALUES (?, ?, ?)';

    try {
        const [result] = await connection.execute(query, [name, email, pass]);
        res.status(201).json({ message: 'Usuario creado', result });
    } catch (error) {
        console.error('Error al insertar en la base de datos:', error);
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
})

app.get('/clientes', async (req, res) => {
    let [result] = await connection.execute('SELECT * FROM clientes'); //traes contraseñas y todo (!!!!!)
    res.json(result)
})

app.get('/clientes/:id', async (req, res) => {
    const id = req.params.id;
    let query = 'SELECT * FROM clientes WHERE id=?'
    let [result] = await connection.execute(query, [id])
    res.json(result)
})

app.put('/clientes/:id', async (req, res) => {
    const { name } = await req.body
    const id = req.params.id;
    let query = 'UPDATE clientes SET nombre = ? WHERE id = ?'
    try {
        await connection.execute(query, [name, id])
        res.status(200).json({ message: `Usuario con id: ${id} actualizado a: ${name}` })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error en el servidor' })
    }
})

app.delete('/clientes/:id', async (req, res) => {
    const id = req.params.id;
    let getName = 'SELECT * FROM clientes WHERE id = ?'
    let deleteUser = 'DELETE FROM clientes WHERE id = ?'
    const [[{ nombre }], ...rest] = await connection.execute(getName, [id])
    console.log(nombre)
    if (nombre) {
        try {
            const result = await connection.execute(deleteUser, [id])
            console.log(result);
            res.status(200).json({ message: `Usuario ${nombre} con id: ${id} ha sido eliminado` })

        } catch (error) {
            res.status(500).json({ error: error });
        }
    } else {
        res.status(404).json({ error: `El usuario con id: ${id} no existe` })
    }

})

app.get('/carrito/:id', async (req, res) => {
    const id = req.params.id;
    let query = 'SELECT T0.idCliente, T1.nombre AS nombreCliente,T1.email, T2.nombre AS nombreProducto, T2.descripcion, T2.precio FROM carritoDeCompras AS T0 INNER JOIN clientes AS T1 ON T0.idCliente = T1.id INNER JOIN productos AS T2 ON T0.idProducto = T2.id WHERE T0.idCarrito=?'
    let [result] = await connection.execute(query, [id])
    res.json(result)
})



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Escuchado en http://localhost:3000');
})
