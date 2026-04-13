Add-Type -AssemblyName System.IO.Compression.FileSystem
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$z = [System.IO.Compression.ZipFile]::OpenRead("C:\Users\hara\.claude\output\template.pptx")

$t = $z.Entries | Where-Object { $_.FullName -match "ppt/theme/theme1.xml" }
$r = New-Object System.IO.StreamReader($t.Open(), [System.Text.Encoding]::UTF8)
$x = $r.ReadToEnd(); $r.Dispose()

Write-Host "=== COLORS ==="
$c = [regex]::Matches($x, 'val="([A-Fa-f0-9]{6})"')
$u = @{}
foreach($m in $c) {
    $v = $m.Groups[1].Value
    if(-not $u[$v]) { Write-Host $v; $u[$v] = 1 }
    if($u.Count -ge 20) { break }
}

Write-Host "=== FONTS ==="
$f = [regex]::Matches($x, 'typeface="([^"]+)"')
$uf = @{}
foreach($m in $f) {
    $v = $m.Groups[1].Value
    if(-not $uf[$v]) { Write-Host $v; $uf[$v] = 1 }
    if($uf.Count -ge 15) { break }
}

# Slide master background
$master = $z.Entries | Where-Object { $_.FullName -eq "ppt/slideMasters/slideMaster1.xml" }
$sr = New-Object System.IO.StreamReader($master.Open(), [System.Text.Encoding]::UTF8)
$mx = $sr.ReadToEnd(); $sr.Dispose()
Write-Host "=== MASTER BG ==="
$bgc = [regex]::Matches($mx, 'srgbClr val="([A-Fa-f0-9]{6})"')
foreach($b in $bgc) { Write-Host $b.Groups[1].Value }

# Presentation size
$p = $z.Entries | Where-Object { $_.FullName -eq "ppt/presentation.xml" }
$sr2 = New-Object System.IO.StreamReader($p.Open(), [System.Text.Encoding]::UTF8)
$px = $sr2.ReadToEnd(); $sr2.Dispose()
if($px -match 'cx="(\d+)" cy="(\d+)"') {
    $w = [math]::Round([int]$Matches[1] / 914400, 2)
    $h = [math]::Round([int]$Matches[2] / 914400, 2)
    Write-Host "=== SIZE === ${w} x ${h} inches"
}

$z.Dispose()
