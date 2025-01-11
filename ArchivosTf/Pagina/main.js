/*--------------------FUNCIONES--------------------*/

/**
 * Función que hace una llamada a la api de cervezas que luego sera nuestro json en nuestro contenedor
 * @param {string} tipo tipo de cerveza
 * @returns {Promise} Devuelve una PROMESA en forma de array
 */
function getFetch(tipo, pagina){

    return fetch("https://api.sampleapis.com/beers/" + tipo)
    .then((result) => result.json())
    .catch((error) => {
        console.error("Error al realizar la solicitud: ", error);
        throw error;
    });

};

/**
 * Crea todos los nodos donde irá toda la información de cada carta de cerveza
 * @param {Object} objeto recibe por parametro cada objeto
 * @returns {Node} Devuelve un nodo de dom
 */
function creaCarta(objeto){

    let nodoDom = document.createElement("article");
    nodoDom.className = "contenedora__articulo"

    //creamos la imagen y la metemos en el articulo
    let img = crearElemento(nodoDom, "img");
    img.src = objeto.image;

    //Esto es porque hay imagenes que no funcionan, entonces en caso de error mostrare otra imagen
    img.onerror = () => {
        img.src = "./assets/imgs/error.png";
    };

    //creamos el div que contendra la información y lo metemos en el articulo
    let div = crearElemento(nodoDom, "div");

    //cremos todos los p con la información u lo metemos en el div
    crearElemento(div, "p", "","", objeto.name);
    crearElemento(div, "p", "","", objeto.price);
    crearElemento(div, "p", "","", "Media: " + objeto.average);
    crearElemento(div, "p", "","", "Reviews: " + objeto.reviews);

    return nodoDom;

};

/**
 * Función para limpiar la seccion cuando se hace el cambio de un tipo de cerveza a otra
 */
function limpiarSection(dom){

    dom.innerHTML = "";

};

/**
 * Función que llama a la funcion de creacarta por cada paso al recorrer el array de las cervezas, creando asi cada una de las castas para 
 * todas las cervezas
 * @param {Array} arr array de las cervezas 
 */
function creaCartas(arr){

    //limpiamos la seccion
    limpiarSection(document.querySelector("#contenedora"));

    //recorremos el array y llamamos a la funcion de crearCarta individual
    arr.forEach(elemento => {

        let nodoDom = creaCarta(elemento);
        fragmento.appendChild(nodoDom);

        //creamos el listener de cada articulo para añadir las cosas al carrito
        nodoDom.addEventListener("click", () => {

            //limpiar seccion de carrito
            limpiarSection(document.querySelector(".cervezas__carrito"));

            anadirAlCarro (arrCarrito, elemento);

        });

    });
    
    //añadir al main el fragmento con todas las cartas (articulos)
    section.appendChild(fragmento);

};

/**
 * Función que cambia el estilo del scale a un elemento DOM
 * @param {Node} elemento Elemento Dom 
 * @param {int} scale El numero de scale que quieras hacerle
 */
function cambiarEstilo(elemento ,scale){
    elemento.style.scale = scale;
    elemento.style.transition = "scale 1.5s -0.5s linear";
}

/**
 * Función que reproduce un sonido
 */
function ohYeah(){

    let sonido = new Audio("./assets/ouh_yeah.mp3");
    sonido.play();

};

/**
 * Función que dados unos parametros filtrará por los parametros introducidos los elementos del array también introducido
 * y los añadira a un array
 * @param {Array} arr array del cual filtraremos
 * @param {string} filtro parametro de cada objeto de array
 * @param {string} operando 
 * @param {Number} cant cantidad por la que filtrar
 * @returns {Array} devuelve un array con los objetos filtrados
 */
function filtro (arr, filtrar, operador, cant){
    
    let resultadoBusqueda = [];
    /**
     * hay que usar corchetes para acceder a la propiedad del objeto que sera el filtrar (precio, valoracion...)
     * porque si pongo element.filtrar, buscara una propiedad filtrar en el objeto y no la hay.
     * para poner una variable como propiedad de un objeto usamos los corchetes
     */
    arr.forEach(element => {
        switch (operador){
            case ">":
                if (element[filtrar] > cant){
                    resultadoBusqueda.push(element);
                }
            break;
                
            case "<":
                if (element[filtrar] < cant){
                    resultadoBusqueda.push(element);
                }
            break;

            case "==":
                if (element[filtrar] == cant){
                    resultadoBusqueda.push(element);
                }
            break;
        }
    });
    return resultadoBusqueda;
    
}

/**
 * Función para cambiar la estructura de los objetos del array
 * @param {Array} arr  
 * @returns {Array} devuelve el mismo array pero con la estructura modificada
 */
function modApiData(arr) {

    let arrMod = arr.map( elemento => {

        //Con el map destructuro y separo la parte de rating y del precio del resto de claves del objeto (elemento)
        const { rating, ...rest } = elemento
        
        //aqui separo average y reviews de rating
        const { average, reviews } = rating

        //aqui devuelvo la estructura del objeto que es el resto del principio (todo menos la clave de rating)
        //mas el average y las reviews
        //en definitiva he cambiado la estructura del objeto para quitar el array que habia dentro del objeto
        return { ...rest, average: +average.toFixed(3), reviews, price: +elemento.price.slice(1) }
        //a la key de average le pongo un toFixed para redondear a 3 decimales
        //y a la key de price le quito el simbolo del dolar con el slice(1)
        //el + es un parseInt es decir lo parsea a número

    });
    return arrMod;

}

/**
 * Funcion que dado un array crea una tabla con la informacion del array
 * @param {Array} arr  
 * @returns {Node}
 */
function creaTabla (arr){

    //Crear boton de eliminar carrito
    crearElemento(document.querySelector(".cervezas__carrito"), "button", "borrarCarrito", "borrarCarrito", "Borrar carrito")

    let tabla = document.createElement("table");
    tabla.className = "cervezas__carrito__tabla";
    crearElemento(tabla, "caption", "cervezas__carrito__caption", "cervezas__carrito__caption", "Carrito");

    //fila de información
    let filaInfo = crearElemento(tabla, "tr");

    //columnas de información
    crearElemento(filaInfo, "th", "thCantidad", "thCantidad", "Cantidad");
    crearElemento(filaInfo, "th", "thNombre", "thNombre", "Nombre");
    crearElemento(filaInfo, "th", "thPrecio", "thPrecio", "Precio");

    arr.forEach(element => {
        let fila = crearElemento(tabla, "tr");

        crearElemento(fila, "td", "celda", "celda", element.cantidad);
        crearElemento(fila, "td", "celda", "celda", element.name);
        crearElemento(fila, "td", "celda", "celda", element.price);

        //boton borrar
        let tdBorrar = crearElemento(fila, "td");
        crearElemento(tdBorrar, "button", "borrarUnoCarrito", "borrarUnoCarrito", "Borrar uno");

        tdBorrar.addEventListener("click", () => {
            eliminarUnoDelCarrito(arr, element);
        });

    });
    return tabla

}

function eliminarUnoDelCarrito (array, elemento){

    if (elemento.cantidad > 1){
        //si el elemento tiene mas de 1 en cantidad, le resto uno
        elemento.cantidad--;
    }else{
        //cojo el indice del elemento en el array
        let indiceElemeto = array.findIndex(item => item.id === elemento.id);
        //lo saco del array con el splice donde el primer elemento es el indice y el segundo cuantos elementos quiero eliminar
        array.splice(indiceElemeto, 1);
    }

    //actualizar el local storage el stringify convierte el objeto a una cadena de texto con formato json
    localStorage.setItem('carrito', JSON.stringify(array));

    //limpiar la sección y actualizar la tabla
    limpiarSection(document.querySelector(".cervezas__carrito")); 
    return array;
}

/**
 * Función para crear un nodo y ponerlo dentro de otro con un id y un textContent
 * @param {node} elementoPardre Elemento al que hacerle el appendChild
 * @param {string} elementoACrear Elemento que quieres crear
 * @param {string} ident id que le quieres dar al nodo
 * @param {string} clase clase que se le quiere dar al nodo
 * @param {string} contenido Contenido que quieres que tenga
 * @returns {Node} Devuelve un nodo de dom
 */
function crearElemento(elementoPardre, elementoACrear, ident="", clase="", contenido=""){

    let nodo = document.createElement(elementoACrear);
    nodo.textContent = contenido;
    nodo.id = ident;
    nodo.className = clase
    elementoPardre.appendChild(nodo);
    return nodo;

}  

/**
 * Función para añadir elementos al carrito, que tambien guarda el carrito en el local storage
 * @param {array} arrCarrito 
 * @param {object} elemento 
 */
function anadirAlCarro (arrCarrito, elemento){

    document.querySelector(".cervezas__mensaje").innerHTML = "Artículo añadido al carrito";
    cambiarEstilo(document.querySelector(".cervezas__mensaje"), 1);

    //con find verificamos si esta o no el elemento en el array de carrito modificado
    let cerv = arrCarrito.find(cerveza => cerveza.id === elemento.id)

    if (cerv){
        //si existe, incrementamos la propiedad cantidad que creamos abajo cuando es la primera vez que lo metemos en el array
        cerv.cantidad++;
    }else{
        //si no existe, desestructuramos el elemento, le añadimos la propiedad cantidad con el valor de 1 y lo añadimos al array
        arrCarrito.push({ ...elemento, cantidad: 1 });
    }

    //arrCarrito.push(elemento);

    localStorage.setItem('carrito', JSON.stringify(arrCarrito));

    setTimeout(() => {
        cambiarEstilo(document.querySelector(".cervezas__mensaje"), 0)
    }, 800);

}

/*--------------------FIN FUNCIONES--------------------*/

/*--------------------MANEJO--------------------*/

//cogemos el main que esta dentro del body
let main = document.querySelector("main");

//creamos la sección que contendra todas las cartas de cervezas y la metemos en el main
let section = document.createElement("section");
section.id = "contenedora";
main.appendChild(section);

//creamos fragmento para mejor optimización de los recursos
let fragmento = document.createDocumentFragment();

//coger las a para añadirles los listeners
let aAle = document.querySelector("body main nav ul li:first-of-type a");
let aStouts = document.querySelector("body main nav ul li:last-of-type a");

//crear un array que contendra todos los elementos del carrito
let arrCarrito = [];

/*--------------------FIN MANEJO--------------------*/

/*--------------------EVENTOS--------------------*/

//evento para el boton de las ales
aAle.addEventListener("click", () => {

    document.querySelector(".cervezas__titulo").innerHTML = "Cervezas Ale";

    getFetch("ale")
    .then((datos) => {
        const modData = modApiData(datos);
        creaCartas(modData);
    });

    ohYeah();

});

//evento para el boton de las stouts
aStouts.addEventListener("click", () => {

    document.querySelector(".cervezas__titulo").innerHTML = "Cervezas Stouts";

    getFetch("stouts")
    .then((datos) => {
        const modData = modApiData(datos);
        creaCartas(modData);
    });;
    ohYeah();

});

//evento para el boton de filtrar
document.querySelector("#filtrar").addEventListener("click", () => {

    //limpia el mensaje de error si lo hubiese cada vez que le damos a filtrar y la seccion contenedora
    limpiarSection(document.querySelector(".cervezas__mensaje"));
    limpiarSection(document.querySelector("#contenedora"));

    let tipo = document.forms.cervezas__filtro__form.tipo.value;
    let filtraPor = document.forms.cervezas__filtro__form.select.value;
    let operador = document.forms.cervezas__filtro__form.operando.value;
    let numero = parseInt(document.forms.cervezas__filtro__form.cantidad.value);

    getFetch(tipo)
    .then((datos) => {
        const modData = modApiData(datos);
        let filtrados = filtro(modData, filtraPor, operador, numero);

        if (filtrados.length != 0){
            creaCartas(filtrados);
        }else{
            document.querySelector(".cervezas__mensaje").innerHTML = "No se encontraron cervezas con esos filtros";
        }

    })

});

//evento para el boton del carrito
document.querySelector("#carrito").addEventListener("click", () => {

    //limpiar secciones de mensaje y carrito
    limpiarSection(document.querySelector(".cervezas__mensaje"));
    limpiarSection(document.querySelector(".cervezas__carrito"));

    let section = document.querySelector(".cervezas__carrito");

    // Esto es una especie de operador ternario que si el primero es true devolvera el primero, sino ( || ), esto que es el or, devolvera en este caso un array vacio( [] )
    //Aqui cojo del local storage (especie de cookies) el carrito en caso de que lo haya, sino hay nada en el local storage sera un array vacio
    //el parse al contrario que el stringify convierte la cadena de texto en formato json en un objeto js
    arrCarrito = JSON.parse(localStorage.getItem('carrito')) || [];

    let tabla = creaTabla(arrCarrito);
    section.appendChild(tabla);

    //Listener para borrar el carrito
    document.querySelector("#borrarCarrito").addEventListener("click", () => {

        //si hay el el local storage un carrito guardado, lo borramos
        localStorage.removeItem('carrito');

        //si no hay nada en el local storage pero queremos borrar el carrito pues ponemos el array vacia
        //carritoConCantidades = [];
        arrCarrito = [];
        section.textContent = "";

    });

});

/*--------------------FIN EVENTOS--------------------*/
