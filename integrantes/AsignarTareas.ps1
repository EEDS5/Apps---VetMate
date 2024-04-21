# AsignarTareas.ps1

# Leer los nombres de los integrantes desde el archivo CSV
$integrantes = Get-Content -Path .\integrantes.csv

# Leer las tareas desde el archivo CSV, especificando el delimitador
$tareas = Get-Content -Path .\tareas.csv

# Mezclar aleatoriamente las tareas
$tareasMezcladas = $tareas | Get-Random -Count $tareas.Count

# Crear o limpiar el archivo de log
$nombreArchivoLog = ".\asignaciones.log"
if (Test-Path $nombreArchivoLog) {
    Clear-Content $nombreArchivoLog
} else {
    New-Item -Path $nombreArchivoLog -ItemType File
}

# Asignar tareas a los integrantes y escribir en el log
for ($i = 0; $i -lt $integrantes.Count; $i++) {
    $integrante = $integrantes[$i]
    $tarea = $tareasMezcladas[$i]
    $lineaLog = "$integrante | $tarea"
    
    # Escribir la asignación en el archivo de log
    Add-Content -Path $nombreArchivoLog -Value $lineaLog
}

# Mostrar mensaje de finalización
Write-Host "Las asignaciones de tareas se han registrado en '$nombreArchivoLog'."