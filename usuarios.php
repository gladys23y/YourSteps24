<?php

$url = "https://jsonplaceholder.typicode.com/users";

$response = @file_get_contents($url);

$usuarios = [];

if($response){
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
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap"
rel="stylesheet">

</head>

<body>

<div class="contenido">

<a href="../../frontend/dashboard.html" class="volver">
    ← Volver al inicio
</a>
<section class="titulo">

<h1>
Usuarios de la
<span>API</span>
</h1>

<p>
</p>

</section>


<div class="tabla">

<table>

<thead>

<tr>

<th>Nombre</th>
<th>Correo electrónico</th>
<th>Ciudad</th>
<th>Empresa</th>

</tr>

</thead>

<tbody>

<?php

foreach($usuarios as $usuario){

?>

<tr>

<td><?php echo $usuario['name']; ?></td>

<td><?php echo $usuario['email']; ?></td>

<td><?php echo $usuario['address']['city']; ?></td>

<td><?php echo $usuario['company']['name']; ?></td>

</tr>

<?php

}

?>

</tbody>

</table>

</div>

</div>

</body>

</html>