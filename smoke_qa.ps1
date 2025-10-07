$ErrorActionPreference = 'Stop'
$base = 'https://tp05-backend-qa-chdtg5exgzarc7hd.brazilsouth-01.azurewebsites.net'

$rnd = Get-Random -Maximum 1000000
$name = "smoke_$rnd"
$email = "$name@example.com"

Write-Output "NAME=$name EMAIL=$email"

try {
    Write-Output '--- GET /users (before) ---'
    $listBefore = Invoke-RestMethod -Uri "$base/users" -Method Get -TimeoutSec 30
    $listBefore | ConvertTo-Json -Depth 5 | Write-Output

    Write-Output '--- POST create ---'
    $create = Invoke-RestMethod -Uri "$base/users" -Method Post -Body (ConvertTo-Json @{ name=$name; email=$email }) -ContentType 'application/json' -TimeoutSec 30
    $create | ConvertTo-Json -Depth 5 | Write-Output
    $id = $create.id

    Write-Output '--- POST duplicate (expect error) ---'
    try {
        $dup = Invoke-RestMethod -Uri "$base/users" -Method Post -Body (ConvertTo-Json @{ name=$name; email = "$name-dup@example.com" }) -ContentType 'application/json' -TimeoutSec 30
        $dup | ConvertTo-Json -Depth 5 | Write-Output
    } catch {
        Write-Output 'Expected duplicate error:'
        if ($_.Exception.Response) {
            $_.Exception.Response.StatusCode.Value__ | Write-Output
            $_.Exception.Response.Content.ReadAsStringAsync().Result | Write-Output
        } else {
            $_.Exception.Message | Write-Output
        }
    }

    if ($id) {
        Write-Output '--- PUT update ---'
        $up = Invoke-RestMethod -Uri "$base/users/$id" -Method Put -Body (ConvertTo-Json @{ name = "$name-upd"; email = "$name-upd@example.com" }) -ContentType 'application/json' -TimeoutSec 30
        $up | ConvertTo-Json -Depth 5 | Write-Output

        Write-Output '--- DELETE ---'
        Invoke-RestMethod -Uri "$base/users/$id" -Method Delete -TimeoutSec 30
        Write-Output "Deleted id=$id"
    }

    Write-Output '--- GET /users (after) ---'
    $listAfter = Invoke-RestMethod -Uri "$base/users" -Method Get -TimeoutSec 30
    $listAfter | ConvertTo-Json -Depth 5 | Write-Output

    Write-Output 'Smoke tests completed.'
} catch {
    Write-Output 'Error during smoke run:'
    Write-Output $_.Exception.Message
}
