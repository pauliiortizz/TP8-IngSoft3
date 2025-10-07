$ErrorActionPreference = 'Stop'
$base = 'https://tp05-backend-qa-chdtg5exgzarc7hd.brazilsouth-01.azurewebsites.net'
$rnd = Get-Random -Maximum 1000000
$name = "valid_test_$rnd"
$email = "$name@example.com"

Write-Output "Creating user: $name"
try {
    $r1 = Invoke-RestMethod -Uri "$base/users" -Method Post -Body (ConvertTo-Json @{ name=$name; email=$email }) -ContentType 'application/json' -TimeoutSec 30
    $r1 | ConvertTo-Json -Depth 5 | Write-Output
} catch {
    Write-Output 'First create failed:'
    if ($_.Exception.Response) { $_.Exception.Response.StatusCode.Value__ | Write-Output; $_.Exception.Response.Content.ReadAsStringAsync().Result | Write-Output } else { $_.Exception.Message | Write-Output }
}

Write-Output 'Creating duplicate (should get 409)'
try {
    $r2 = Invoke-RestMethod -Uri "$base/users" -Method Post -Body (ConvertTo-Json @{ name=$name; email = "$name-dup@example.com" }) -ContentType 'application/json' -TimeoutSec 30
    $r2 | ConvertTo-Json -Depth 5 | Write-Output
} catch {
    Write-Output 'Duplicate create response:'
    if ($_.Exception.Response) { $_.Exception.Response.StatusCode.Value__ | Write-Output; $_.Exception.Response.Content.ReadAsStringAsync().Result | Write-Output } else { $_.Exception.Message | Write-Output }
}

# cleanup: delete created user if exists
if ($r1 -and $r1.id) {
    try { Invoke-RestMethod -Uri "$base/users/"$r1.id -Method Delete -TimeoutSec 30; Write-Output "Deleted id=$($r1.id)" } catch { Write-Output 'Cleanup delete failed' }
}
