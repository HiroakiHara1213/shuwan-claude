Add-Type -AssemblyName System.IO.Compression.FileSystem
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$z = [System.IO.Compression.ZipFile]::OpenRead("C:\Users\hara\.claude\output\template.pptx")

# List all entries
Write-Host "=== ALL FILES ==="
$z.Entries | ForEach-Object { Write-Host $_.FullName }

Write-Host ""
Write-Host "=== SLIDE1 FULL XML ==="
$s1 = $z.Entries | Where-Object { $_.FullName -eq "ppt/slides/slide1.xml" }
$r = New-Object System.IO.StreamReader($s1.Open(), [System.Text.Encoding]::UTF8)
$xml = $r.ReadToEnd(); $r.Dispose()
Write-Host $xml

Write-Host ""
Write-Host "=== SLIDE1 RELS ==="
$s1r = $z.Entries | Where-Object { $_.FullName -eq "ppt/slides/_rels/slide1.xml.rels" }
if ($s1r) {
    $r2 = New-Object System.IO.StreamReader($s1r.Open(), [System.Text.Encoding]::UTF8)
    Write-Host $r2.ReadToEnd(); $r2.Dispose()
}

Write-Host ""
Write-Host "=== SLIDE LAYOUTS ==="
1..3 | ForEach-Object {
    $layout = $z.Entries | Where-Object { $_.FullName -eq "ppt/slideLayouts/slideLayout$_.xml" }
    if ($layout) {
        $r3 = New-Object System.IO.StreamReader($layout.Open(), [System.Text.Encoding]::UTF8)
        $lx = $r3.ReadToEnd(); $r3.Dispose()
        Write-Host "--- Layout $_ (first 2000 chars) ---"
        Write-Host $lx.Substring(0, [Math]::Min(2000, $lx.Length))
    }
}

Write-Host ""
Write-Host "=== MEDIA FILES ==="
$z.Entries | Where-Object { $_.FullName -match "ppt/media/" } | ForEach-Object {
    Write-Host "$($_.FullName) ($($_.Length) bytes)"
}

$z.Dispose()
