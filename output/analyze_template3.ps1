Add-Type -AssemblyName System.IO.Compression.FileSystem
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$z = [System.IO.Compression.ZipFile]::OpenRead("C:\Users\hara\.claude\output\template.pptx")

# Layout 1
$l1 = $z.Entries | Where-Object { $_.FullName -eq "ppt/slideLayouts/slideLayout1.xml" }
$r1 = New-Object System.IO.StreamReader($l1.Open(), [System.Text.Encoding]::UTF8)
$lx1 = $r1.ReadToEnd(); $r1.Dispose()
Write-Host "=== LAYOUT 1 ==="
Write-Host $lx1.Substring(0, [Math]::Min(4000, $lx1.Length))

Write-Host ""

# Slide Master
$sm = $z.Entries | Where-Object { $_.FullName -eq "ppt/slideMasters/slideMaster1.xml" }
$rsm = New-Object System.IO.StreamReader($sm.Open(), [System.Text.Encoding]::UTF8)
$smx = $rsm.ReadToEnd(); $rsm.Dispose()
Write-Host "=== SLIDE MASTER (first 5000) ==="
Write-Host $smx.Substring(0, [Math]::Min(5000, $smx.Length))

$z.Dispose()
