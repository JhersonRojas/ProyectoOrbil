
    // <----------------- Mapeo de los datos del login para acceder ------------------->
export interface Login_Interface {
    confirm: boolean;
    msj: string;
    user:    User;
    token:   string;
}

export interface User {
    Pk_Identificacion: number;
    Nombre:            string;
    Tipo_Usuario:      string;
}

    // <----------------- Mapear los proyectores que hay en la base de datos ------------------->
export interface Listar_Proyectores_Interface {
    confirm: boolean;
    datos:   Dato[];
}

    // <----------------- Mapear los libros que hay en la base de datos ------------------->
export interface Listar_Libros_Interface {
    confirm: boolean;
    msj: string;
    datos: Dato[];
}
    
export interface Dato {
    Pk_Elemento:     string;
    Estado_Elemento: string;
    Imagen:          string;
    Nombre_Elemento: string;
    Autor:           string;
    Descripcion:     null | string;
    Stock:           number;
    Archivo_Aporte:  null;
    Fk_Categoria:    number;
    Categoria:       Categoria;
}

export interface Categoria {
    Nombre_Categoria: string;
}

// <----------------- Mapear las categorias de los libros de la base de datos ------------------->
export interface Listar_Categorias_Interface {
    Pk_Categorias:    number;
    Nombre_Categoria: string;
    Imagen_Categoria: string;
}

    // <----------------- Mapeo de los datos que recive el Api Rest para reservar un computador ------------------->
export interface Reservar_Computador_Interface {
    usuario:          number; 
    cantidad:         number;
    joranadaReserva:  string; 
    fecha:            string;
    mensaje:          string;
}

    // <----------------- Mapeo de los datos que recive el Api Rest para reservar un ambiente ------------------->
export interface Reserva_Ambiente_Interface {
    confirm: boolean;
    datos:   Datos;
}

export interface Datos {
    Pk_Movimiento:   number;
    Estado_Mv:       string;
    Jornada_Reserva: string;
    Fecha_Inicio:    string;
    Otra_Fecha:      string;
    Fecha_Fin:       string;
    Cantidad:        number;
    Fk_Usuario:      number;
    Fk_Elemento:     string;
}

    // <-----------------  Mapeo de los datos que recive el Api Rest para reservar un proyector ------------------->
export interface Reserva_Proyector_Interface{
    fecha:            string;
    jornada:          string;
    usuario:          number;
    mensaje:          string; 
    datos:            string;
    boolean:          string; 
}