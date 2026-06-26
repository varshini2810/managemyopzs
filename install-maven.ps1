$ProgressPreference = 'SilentlyContinue'
Invoke-WebRequest -Uri https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip -OutFile maven.zip
Expand-Archive maven.zip -DestinationPath C:\ -Force
[Environment]::SetEnvironmentVariable('MAVEN_HOME', 'C:\apache-maven-3.9.6', 'User')
$oldPath = [Environment]::GetEnvironmentVariable('Path', 'User')
if ($oldPath -notmatch 'apache-maven') {
    [Environment]::SetEnvironmentVariable('Path', $oldPath + ';C:\apache-maven-3.9.6\bin', 'User')
}
Write-Output "Maven installed successfully to C:\apache-maven-3.9.6"
