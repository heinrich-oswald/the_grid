<#
  Quick API Endpoint Diagnostic

  Usage examples:
    # Probe a specific Render host
    ./check_api_endpoints.ps1 -BaseUrl "https://your-service.onrender.com"

    # Probe with admin token when route is protected
    ./check_api_endpoints.ps1 -BaseUrl "https://your-service.onrender.com" -ApiBase "/api/admin" -Token "YOUR_TOKEN"

  Notes:
    - BaseUrl: service domain (no trailing slash), e.g. https://example.onrender.com
    - ApiBase: base path for admin API (default: /api/admin)
    - Token: optional Bearer token for endpoints that require auth
#>

param(
  [string]$BaseUrl = "https://the-grid-admin-api.onrender.com",
  [string]$ApiBase = "/api/admin",
  [string]$Token = ""
)

# Enforce modern TLS for older environments
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

function Show-Result {
  param(
    [string]$Url,
    [int]$StatusCode,
    [string]$StatusDesc,
    [string]$Body
  )
  Write-Host ("URL: {0}" -f $Url)
  Write-Host ("Status: {0} {1}" -f $StatusCode, $StatusDesc)
  if ($Body) {
    $snippet = $Body.Substring(0, [Math]::Min(200, $Body.Length))
    Write-Host ("Body: {0}" -f $snippet)
  } else {
    Write-Host "Body:"
  }
  Write-Host "---"
}

$headers = @{}
if ($Token) { $headers["Authorization"] = "Bearer $Token" }

function Probe($url) {
  try {
    $res = Invoke-WebRequest -Uri $url -UseBasicParsing -Method Get -Headers $headers -TimeoutSec 15
    Show-Result -Url $url -StatusCode $res.StatusCode -StatusDesc $res.StatusDescription -Body $res.Content
  } catch {
    if ($_.Exception.Response) {
      $code = $_.Exception.Response.StatusCode.value__
      $desc = $_.Exception.Response.StatusDescription
      try {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $content = $reader.ReadToEnd()
      } catch { $content = "" }
      Show-Result -Url $url -StatusCode $code -StatusDesc $desc -Body $content
    } else {
      Write-Host ("URL: {0}" -f $url)
      Write-Host ("Error: {0}" -f $_.Exception.Message)
      Write-Host "---"
    }
  }
}

$root = $BaseUrl.TrimEnd('/')
$api = if ($ApiBase) { $root + $ApiBase } else { $root }

$urls = @(
  $root + "/",           # root
  $root + "/health",     # generic health
  $root + "/status",     # status
  $root + "/api/health", # api health
  $root + "/api",        # api root
  $api + "/db_health"     # admin db health
)

foreach ($u in $urls) { Probe $u }