*** Settings ***
Library           SeleniumLibrary
Library    XML
Resource          KeyWord.robot
Suite Setup       Open Browser And Maximize
Suite Teardown    Close Browser

# Test Case For Login Page Admin
*** Test Cases ***
Test Case For Login Page Admin
    [Tags]    LoginPageAdmin
    [Documentation]    Test Case For Login Page Admin
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/Admin/Login/Positive

    Go To    ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[2]    LoginPass1.png
    Input Text    xpath=//*[@id="username"]    20240001
    Input Password    xpath=//*[@id="password"]    1234567
    Click And Capture    xpath=//*[@id="root"]/div/div/div/main/div/div/div/div/form/button    LoginPass2.png

    Click And Capture    xpath=//*[@id="root"]/div/div    LoginPass3.png

    Sleep    3s
    Capture Page Screenshot    LoginPass4.png