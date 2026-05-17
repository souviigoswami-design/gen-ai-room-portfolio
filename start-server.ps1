$port = 1997
$folder = "C:\Users\SOUVIK GOSWAMI\Downloads\anti 01"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "Server started at http://localhost:$port" -ForegroundColor Green
Write-Host "Press CTRL+C to stop." -ForegroundColor Gray

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".woff2"= "font/woff2"
}

while ($listener.IsListening) {
    $ctx  = $listener.GetContext()
    $req  = $ctx.Request
    $res  = $ctx.Response
    $url  = $req.Url.LocalPath
    if ($url -eq "/" -or $url -eq "") { $url = "/index.html" }
    $file = Join-Path $folder $url.TrimStart("/")
    if (Test-Path $file -PathType Leaf) {
        $ext   = [IO.Path]::GetExtension($file).ToLower()
        $mime  = if ($mimeTypes[$ext]) { $mimeTypes[$ext] } else { "application/octet-stream" }
        $bytes = [IO.File]::ReadAllBytes($file)
        $res.ContentType = $mime
        $res.ContentLength64 = $bytes.Length
        $res.StatusCode = 200
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
        Write-Host "[OK] $url" -ForegroundColor Green
    } else {
        $bytes = [Text.Encoding]::UTF8.GetBytes("<h1>404 Not Found</h1>")
        $res.StatusCode = 404
        $res.ContentType = "text/html"
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
        Write-Host "[404] $url" -ForegroundColor Red
    }
    $res.OutputStream.Close()
}
