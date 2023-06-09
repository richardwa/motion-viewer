
if (-not (Test-Path -Path Dockerfile)) {
    Write-Host "Dockerfile required at current directory"
    Exit
}
git add .
git commit -m"update"
npm run build

$targetHost = 'rich@omv'

# Get the current working directory path
$currentDirectoryPath = Get-Location

# Extract the directory name from the path
$projectName = Split-Path -Leaf $currentDirectoryPath


ssh $targetHost "rm -rf $projectName && mkdir $projectName"

# Read the Dockerfile content
$dockerfileContent = Get-Content -Path Dockerfile

# Regular expression pattern to match COPY lines
$copyPattern = '^\s*COPY\s+(?<source>.*?)\s+(?<destination>.*?)\s*$'

# Iterate through the Dockerfile content and extract COPY lines
$dockerfileContent | Where-Object { $_ -match $copyPattern } | ForEach-Object {
    $source = $Matches['source']
    scp -r $source "${targetHost}:~/$projectName" 
}
scp Dockerfile "${targetHost}:~/$projectName"

$gitHash = & git rev-parse HEAD
$shortGitHash = $gitHash.Substring(0, 6)
$tag = "${projectName}:$shortGitHash"

$script = @"
echo "first line not executed - not sure why"

#!/bin/bash
cd $projectName
pwd
docker build -t $tag .

# Check if the container is running
if docker container inspect -f '{{.State.Running}}' "$projectName" >/dev/null 2>&1; then
  # Stop the container
  docker container stop "$projectName"
  echo "Container $projectName stopped."
fi

# Check if the container exists
if docker container inspect "$projectName" >/dev/null 2>&1; then
  # Remove the container
  docker container rm "$projectName"
  echo "Container $projectName removed."
else
  echo "Container $projectName does not exist."
fi

nohup docker run --device=/dev/dri:/dev/dri -d \
    -p 8082:8080 \
    -p 8083:8083 \
    -v ${projectName}:/app/captures \
    -v /usr/lib/x86_64-linux-gnu/dri:/usr/lib/x86_64-linux-gnu/dri \
    --restart=unless-stopped \
    --name $projectName \
    $tag `&
"@

Write-Host $script
$script = $script -replace "`r", ""
ssh rich@omv bash -c $script