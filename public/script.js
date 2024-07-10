
async function crearUsuario() {
    const name = document.querySelector('#nameC').value;
    const email = document.querySelector('#mail').value;
    const pass = document.querySelector('#pass').value;

    try {
        const respuesta = await fetch('/clientes', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name, email: email, pass: pass })
        });

        if (respuesta.ok) {
            alert(`Usuario ${name} creado con exito`)
        } else {
            alert('Hubo un error, vuelve a intentarlo')
        }
    } catch (error) {
        console.log(error)
    }
}

async function leerRegistro() {



    const respuesta = await fetch('/clientes', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
    })

    const usuarios = await respuesta.json();
    console.log(usuarios);

    let ul = document.querySelector('#registro');
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }

    if (usuarios.length > 0) {
        try {
            usuarios.forEach(user => {
                const li = document.createElement('li');
                li.textContent = `Id: ${user.id} > name: ${user.nombre} > ${user.email} `
                ul.appendChild(li);
            });
            return;
        } catch (error) {
            console.log(error);
        }
    } else {
        ul.textContent = "Nada por aquí"
        return;
    }
}

async function actualizarUsuario() {
    const id = document.querySelector('#id_update').value;
    const name = document.querySelector('#name_update').value;

    try {
        const response = await fetch(`/clientes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name })
        })

        const respuesta = await response.json();
        if (respuesta.ok) {
            alert(respuesta.message)
        } else {
            alert(respuesta.message)
        }

    } catch (error) {
        alert('Error en la peticion');
        console.error(error);
    }


}

async function eliminarUsuario() {
    const id = document.querySelector('#id_delete').value;

    try {
        const response = await fetch(`/clientes/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const respuesta = await response.json();
        if (respuesta.ok) {
            alert(respuesta.message)
        } else {
            alert(respuesta.message)
        }
    } catch (error) {

    }
}