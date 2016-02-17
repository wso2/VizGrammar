@echo off
title Deploy Samples to gh-pages

echo "samples" folder contains will deploy to gh-pages branch
echo =======================================================
echo please commit all the changes before continue
echo.

SET /P ANSWER=Do you want to continue (Y/N)? 

if /i {%ANSWER%}=={y} (goto :yes) 
if /i {%ANSWER%}=={yes} (goto :yes) 
goto :no
 
:yes 
echo.
echo Deploying.....
echo.
git subtree push --prefix samples origin gh-pages
echo.
echo Finished!
pause
exit /b 0 

:no 
echo.
pause
exit /b 1