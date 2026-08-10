/* =========================================================
   YOURSTEPS | UBICACIÓN Y RUTAS
========================================================= */


/* =========================================================
   UBICACIÓN DE YOURSTEPS
========================================================= */

const tiendaLat = 18.1340;
const tiendaLng = -94.4580;


/* =========================================================
   CREAR MAPA
========================================================= */

const mapa = L.map('mapa').setView(
    [tiendaLat, tiendaLng],
    14
);


/* =========================================================
   MAPA OPENSTREETMAP
========================================================= */

L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution:
            '&copy; OpenStreetMap contributors',

        maxZoom:
            19
    }
).addTo(mapa);


/* =========================================================
   ICONO DE LA TIENDA
========================================================= */

const iconoTienda = L.divIcon({

    className:
        'yoursteps-marker',

    html: `
        <div class="marker-yoursteps">

            <i class="fa-solid fa-store"></i>

        </div>
    `,

    iconSize:
        [42, 42],

    iconAnchor:
        [21, 42],

    popupAnchor:
        [0, -42]
});


/* =========================================================
   MARCADOR YOURSTEPS
========================================================= */

const marcadorTienda = L.marker(
    [tiendaLat, tiendaLng],
    {
        icon:
            iconoTienda
    }
).addTo(mapa);


/* =========================================================
   POPUP DE LA TIENDA
========================================================= */

marcadorTienda
    .bindPopup(`
    
        <div class="popup-yoursteps">

            <div class="popup-icon">

                <i class="fa-solid fa-store"></i>

            </div>

            <div>

                <strong>
                    YourSteps
                </strong>

                <p>
                    Nuestra tienda
                </p>

            </div>

        </div>

    `)
    .openPopup();


/* =========================================================
   VARIABLES
========================================================= */

let marcadorOrigen = null;

let rutaActual = null;


/* =========================================================
   ICONO DEL LUGAR BUSCADO
========================================================= */

const iconoOrigen = L.divIcon({

    className:
        'search-marker',

    html: `
    
        <div class="marker-search">

            <i class="fa-solid fa-location-dot"></i>

        </div>

    `,

    iconSize:
        [40, 40],

    iconAnchor:
        [20, 40],

    popupAnchor:
        [0, -40]
});


/* =========================================================
   BUSCAR LUGAR
========================================================= */

async function buscarLugar() {


    const input =
        document.getElementById('lugar');

    const boton =
        document.getElementById('btnBuscar');

    const resultado =
        document.getElementById('resultado');


    const lugar =
        input.value.trim();


    /* =====================================================
       VALIDAR INPUT
    ===================================================== */

    if (lugar === '') {

        resultado.innerHTML = `

            <div class="resultado-icon">

                <i class="fa-solid fa-triangle-exclamation"></i>

            </div>

            <div class="resultado-info">

                <span>
                    AVISO
                </span>

                <h3>
                    Escribe un lugar
                </h3>

                <p>
                    Introduce una dirección, colonia,
                    ciudad o lugar para calcular la ruta.
                </p>

            </div>

        `;

        return;
    }


    /* =====================================================
       ESTADO BOTÓN
    ===================================================== */

    boton.disabled =
        true;

    boton.innerHTML = `

        <i class="fa-solid fa-spinner fa-spin"></i>

        <span>
            Buscando...
        </span>

    `;


    try {


        /* =================================================
           BUSCAR COORDENADAS
        ================================================= */

        const url =

            https://nominatim.openstreetmap.org/search +

            ?format=json +

            &q=${encodeURIComponent(lugar)} +

            &limit=1;


        const respuesta =
            await fetch(url);


        if (!respuesta.ok) {

            throw new Error(
                'No fue posible consultar la ubicación.'
            );

        }


        const datos =
            await respuesta.json();


        /* =================================================
           LUGAR NO ENCONTRADO
        ================================================= */

        if (
            !datos ||
            datos.length === 0
        ) {

            resultado.innerHTML = `

                <div class="resultado-icon">

                    <i class="fa-solid fa-location-xmark"></i>

                </div>

                <div class="resultado-info">

                    <span>
                        UBICACIÓN
                    </span>

                    <h3>
                        Lugar no encontrado
                    </h3>

                    <p>
                        No encontramos "${lugar}".
                        Intenta escribir una dirección más específica.
                    </p>

                </div>

            `;

            return;
        }


        /* =================================================
           COORDENADAS DEL ORIGEN
        ================================================= */

        const origenLat =
            parseFloat(datos[0].lat);

        const origenLng =
            parseFloat(datos[0].lon);


        /* =================================================
           ELIMINAR MARCADOR ANTERIOR
        ================================================= */

        if (marcadorOrigen) {

            mapa.removeLayer(
                marcadorOrigen
            );

        }


        /* =================================================
           ELIMINAR RUTA ANTERIOR
        ================================================= */

        if (rutaActual) {

            mapa.removeLayer(
                rutaActual
            );

            rutaActual = null;
        }


        /* =================================================
           CREAR MARCADOR DEL ORIGEN
        ================================================= */

        marcadorOrigen =
            L.marker(
                [origenLat, origenLng],
                {
                    icon:
                        iconoOrigen
                }
            ).addTo(mapa);


        marcadorOrigen.bindPopup(`

            <div class="popup-busqueda">

                <div class="popup-icon search">

                    <i class="fa-solid fa-location-dot"></i>

                </div>

                <div>

                    <strong>
                        Tu ubicación
                    </strong>

                    <p>
                        ${datos[0].display_name}
                    </p>

                </div>

            </div>

        `);


        /* =================================================
           OBTENER RUTA
        ================================================= */

        const rutaURL =

            https://router.project-osrm.org/route/v1/driving/ +

            ${origenLng},${origenLat}; +

            ${tiendaLng},${tiendaLat} +

            ?overview=full +

            &geometries=geojson;


        const respuestaRuta =
            await fetch(rutaURL);


        if (!respuestaRuta.ok) {

            throw new Error(
                'No fue posible calcular la ruta.'
            );

        }


        const datosRuta =
            await respuestaRuta.json();


        /* =================================================
           VALIDAR RUTA
        ================================================= */

        if (
            !datosRuta.routes ||
            datosRuta.routes.length === 0
        ) {

            throw new Error(
                'No se encontró una ruta disponible.'
            );

        }


        const ruta =
            datosRuta.routes[0];


        /* =================================================
           DIBUJAR RUTA
        ================================================= */

        rutaActual =
            L.geoJSON(
                ruta.geometry,
                {

                    style: {

                        color:
                            '#35A6A0',

                        weight:
                            6,

                        opacity:
                            0.85,

                        lineCap:
                            'round',

                        lineJoin:
                            'round'
                    }

                }
            ).addTo(mapa);


        /* =================================================
           AJUSTAR MAPA
        ================================================= */

        const limites =
            L.latLngBounds([

                [origenLat, origenLng],

                [tiendaLat, tiendaLng]

            ]);


        mapa.fitBounds(
            limites,
            {
                padding:
                    [50, 50]
            }
        );


        /* =================================================
           DISTANCIA
        ================================================= */

        const distanciaKm =
            ruta.distance / 1000;


        /* =================================================
           TIEMPO
        ================================================= */

        const minutos =
            Math.round(
                ruta.duration / 60
            );


        let tiempoTexto;


        if (minutos < 60) {

            tiempoTexto =
                ${minutos} minutos;

        } else {

            const horas =
                Math.floor(
                    minutos / 60
                );

            const minutosRestantes =
                minutos % 60;


            if (
                minutosRestantes === 0
            ) {

                tiempoTexto =
                    ${horas} hora${horas > 1 ? 's' : ''};

            } else {

                tiempoTexto =
                    ${horas} h ${minutosRestantes} min;

            }
        }


        /* =================================================
           MOSTRAR RESULTADO
        ================================================= */

        resultado.innerHTML = `

            <div class="resultado-icon">

                <i class="fa-solid fa-route"></i>

            </div>


            <div class="resultado-info">

                <span>
                    RUTA A YOURSTEPS
                </span>

                <h3>
                    Ruta encontrada
                </h3>

                <p>
                    <strong>
                        Desde:
                    </strong>

                    ${datos[0].display_name}
                </p>

                <p>

                    <strong>
                        Distancia:
                    </strong>

                    ${distanciaKm.toFixed(2)} km

                    &nbsp; · &nbsp;

                    <strong>
                        Tiempo aproximado:
                    </strong>

                    ${tiempoTexto}

                </p>

            </div>

        `;


        /* =================================================
           ABRIR MARCADOR
        ================================================= */

        marcadorOrigen.openPopup();


    } catch (error) {


        console.error(
            'Error:',
            error
        );


        resultado.innerHTML = `

            <div class="resultado-icon">

                <i class="fa-solid fa-triangle-exclamation"></i>

            </div>

            <div class="resultado-info">

                <span>
                    ERROR
                </span>

                <h3>
                    No se pudo calcular la ruta
                </h3>

                <p>
                    Ocurrió un problema al buscar
                    la ubicación. Intenta nuevamente.
                </p>

            </div>

        `;


    } finally {


        /* =================================================
           RESTAURAR BOTÓN
        ================================================= */

        boton.disabled =
            false;

        boton.innerHTML = `

            <i class="fa-solid fa-magnifying-glass"></i>

            <span>
                Buscar
            </span>

        `;
    }
}


/* =========================================================
   ENTER PARA BUSCAR
========================================================= */

document
    .getElementById('lugar')
    .addEventListener(
        'keydown',
        function(event) {

            if (
                event.key === 'Enter'
            ) {

                buscarLugar();

            }

        }
    );