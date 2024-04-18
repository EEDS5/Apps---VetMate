# Define el directorio actual como la ruta base
$basePath = Get-Location

# Crear estructura de carpetas
$directories = @(
    "assets\images",
    "assets\fonts",
    "src\components\common",
    "src\components\ui",
    "src\context\AuthContext",
    "src\context\UserContext",
    "src\context\MatchContext",
    "src\screens\Auth",
    "src\screens\Profile",
    "src\screens\Match",
    "src\services\api",
    "src\services\utils",
    "src\services\storage",
    "src\navigation",
    "src\styles"
)

foreach ($dir in $directories) {
    $fullPath = Join-Path -Path $basePath -ChildPath $dir
    if (-Not (Test-Path $fullPath)) {
        New-Item -Path $fullPath -ItemType Directory
    }
}

# Crear archivos
$files = @{
    "src\components\common" = @('Button.js', 'Input.js', 'Layout.js');
    "src\components\ui" = @('Modal.js', 'DatePicker.js');
    "src\context\AuthContext" = @('AuthContext.js', 'authReducer.js');
    "src\context\UserContext" = @('UserContext.js', 'userReducer.js');
    "src\context\MatchContext" = @('MatchContext.js', 'matchReducer.js');
    "src\screens\Auth" = @('LoginScreen.js', 'RegistroScreen.js');
    "src\screens\Profile" = @('PerfilScreen.js', 'HistorialMedicoScreen.js');
    "src\screens\Match" = @('BuscarMatchScreen.js');
    "src\services\api" = @('userApi.js', 'matchApi.js');
    "src\services\utils" = @('validators.js', 'formatters.js');
    "src\services\storage" = @('storageService.js');
    "src\navigation" = @('AppNavigator.js');
    "src\styles" = @('themes.js', 'global.js');
    "assets" = @('app.json', 'babel.config.js', 'metro.config.js', 'package.json', 'package-lock.json');
}

foreach ($path in $files.Keys) {
    foreach ($file in $files[$path]) {
        $fullPath = Join-Path -Path $basePath -ChildPath $path
        $filePath = Join-Path -Path $fullPath -ChildPath $file
        if (-Not (Test-Path $filePath)) {
            New-Item -Path $filePath -ItemType File
        }
    }
}