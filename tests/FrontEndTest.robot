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
    [Tags]        critical
    Go To         ${BASE_URL}/login
    Log           🔎 Checking Login Page...
    Click And Capture    xpath=//input[@name="email"]    email_input.png
    Input Text           xpath=//input[@name="email"]    test@email.com
    Click And Capture    xpath=//input[@name="password"]    password_input.png
    Input Password       xpath=//input[@name="password"]    123456
    Click And Capture    xpath=//button[contains(text(), "เข้าสู่ระบบ")]    login_click.png
    Wait Until Page Contains Element    xpath=//div[contains(text(), "ยินดีต้อนรับ")]    timeout=5s
    Capture Page Screenshot    after_login.png

Test Function On ProfilePage
    Go To         ${BASE_URL}/profile
    Log           👤 เข้าหน้าโปรไฟล์
    Wait Until Page Contains    แก้ไขโปรไฟล์
    Capture Page Screenshot     profile.png

*** Keywords ***
Open Browser And Maximize
    Open Browser    ${BASE_URL}    ${BROWSER}
    Maximize Browser Window
    Set Selenium Speed    0.2s
