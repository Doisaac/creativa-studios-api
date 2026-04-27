CREATE TABLE rol (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT
);

CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    contrasena TEXT NOT NULL,
    id_rol INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_usuario_id_rol
        FOREIGN KEY (id_rol)
        REFERENCES rol(id)
        ON DELETE RESTRICT
);

INSERT INTO rol (nombre, descripcion) VALUES
('ADMIN', 'Dueño o administrador'),
('RECEPCION', 'Gestión de pedidos'),
('PRODUCCION', 'Equipo de producción'),
('INSTALADOR', 'Equipo instalador');