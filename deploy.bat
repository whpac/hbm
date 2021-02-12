:: HBM deploy script
@echo off

:: Remove old distribution
rmdir dist /s /q
mkdir dist

:: Copy required files
mkdir dist\css
xcopy src\css dist\css /E /H /C /R /Q /Y 1>NUL 2>NUL
mkdir dist\html
xcopy src\html dist\html /E /H /C /R /Q /Y 1>NUL 2>NUL

:: Compile SCSS and TypeScript
mkdir dist\js
call tsc
call scss.bat

echo Deploy done.