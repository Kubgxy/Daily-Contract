*** Settings ***
Library           SeleniumLibrary
Resource          KeyWord.robot
Suite Setup       Open Browser And Maximize
Suite Teardown    Close Browser

*** Variables ***
${BROWSER}        chrome
${BASE_URL}       http://localhost:5173

*** Test Cases ***
Test Login Employee
    [Tags]    LoginEmployee
    [Documentation]    Test Login For Employee
    Open Browser    ${BASE_URL}    chrome
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    Login1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240008
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    Login2.png
    Click And Capture    xpath=/html/body/div/div/div/div[2]    Login3.png

Test Function On ProfilePage
    [Tags]    ProfilePage_Seenotification
    [Documentation]    Test Function On ProfilePage
    Open Browser    ${BASE_URL}    chrome
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    ProfilePage1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240003
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    ProfilePage2.png
    Click And Capture    xpath=/html/body/div/div/div/div[2]/div/div[2]/div[1]/div/div[2]/div/div[1]/div/button    ProfilePage3.png

*** Keywords ***
Open Browser And Maximize
    Open Browser    ${BASE_URL}    ${BROWSER}
    Maximize Browser Window
    Set Selenium Speed    0.2s
