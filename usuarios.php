<?php

$url = "https://jsonplaceholder.typicode.com/users";

$response = @file_get_contents($url);

$usuarios = [];

if ($response !== false) {

    $usuarios = json_decode($response, true);

}

?>

<!DOCTYPE html>
<html lang="es">

<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>YourSteps - Usuarios</title>

    <link rel="stylesheet" href="../../frontend/css/usu.css">

    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
        rel="stylesheet">

</head>


<body>


<div class="contenido">


    <!-- BOTÓN VOLVER -->

    <a href="../../frontend/dashboard.html" class="volver">
        ← Volver al inicio
    </a>



    <!-- ENCABEZADO -->

    <section class="titulo">

        <span>
            YOURSTEPS
        </span>

        <h1>
            Usuarios de la
            <span>API</span>
        </h1>

        <p>
            Consulta la información de los usuarios obtenidos
            mediante nuestra API.
        </p>

    </section>



    <!-- TABLA DE USUARIOS -->

    <div class="tabla">

        <table>

            <thead>

                <tr>

                    <th>
                        Nombre
                    </th>

                    <th>
                        Correo electrónico
                    </th>

                    <th>
                        Ciudad
                    </th>

                    <th>
                        Empresa
                    </th>

                </tr>

            </thead>


            <tbody>

                <?php if (!empty($usuarios)): ?>

                    <?php foreach ($usuarios as $usuario): ?>

                        <tr>

                            <td>
                                <?php echo htmlspecialchars($usuario['name']); ?>
                            </td>

                            <td>
                                <?php echo htmlspecialchars($usuario['email']); ?>
                            </td>

                            <td>
                                <?php echo htmlspecialchars($usuario['address']['city']); ?>
                            </td>

                            <td>
                                <?php echo htmlspecialchars($usuario['company']['name']); ?>
                            </td>

                        </tr>

                    <?php endforeach; ?>

                <?php else: ?>

                    <tr>

                        <td colspan="4" class="sin-usuarios">
                            No se pudieron cargar los usuarios.
                        </td>

                    </tr>

                <?php endif; ?>

            </tbody>

        </table>

    </div>


</div>


</body>

</html>