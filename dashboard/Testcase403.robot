*** Settings ***
Library  SeleniumLibrary
Resource  Keyword.robot

*** Variables ***
${BROWSER}  chrome
${URL}  http://localhost:5173

*** Test Cases ***
TC-001 Login
    [Tags]  Login
    Open Browser  ${URL}  ${BROWSER}
    Maximize Browser Window
    Click Element    xpath=//*[@id="root"]/div/div/div/div/div[2]/p
    Input Text    username    20240001
    Input Password    password    zz123456
    Click Element    xpath=//*[@id="root"]/div/div/div/main/div/div/div/div/form/button
    [Teardown]    Sleep    10

TC-002 Goto Register Page
    [Tags]  RegisterPage
    Open Browser  ${URL}  ${BROWSER}
    Maximize Browser Window
    Click Element    xpath=//*[@id="root"]/div/div/div/div/div[2]/p
    Input Text    username    20240001
    Input Password    password    zz123456
    Click Element    xpath=//*[@id="root"]/div/div/div/main/div/div/div/div/form/button

    Wait Until Element Is Visible    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[1]/a[2]
    Click Element    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[1]/a[2]

    [Teardown]    Sleep    10

TC-003 Register
    [Tags]  Register
    Open Browser  ${URL}  ${BROWSER}
    Maximize Browser Window
    Click Element    xpath=//*[@id="root"]/div/div/div/div/div[2]/p
    Input Text    username    20240001
    Input Password    password    zz123456
    Click Element    xpath=//*[@id="root"]/div/div/div/main/div/div/div/div/form/button

    Wait Until Element Is Visible    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[1]/a[2]
    Click Element    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[1]/a[2]
    Input Password    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/form/div[2]/div/div[1]/div/input    Fourthzxx1
    Input Password    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/form/div[2]/div/div[2]/div/input    Fourthzxx1
    Click Element    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/form/div[3]/button
    Input Text    first_name    ภัทรพิสิฏ
    Input Text    last_name    ทองเกิด
    Input Text    email    patarapisit.tho@spumail.net
    Input Text    phone_number    0858294254
    Input Text    address    67/175 ต.บางแม่นาง อ.บางใหญ่ จ.นนทบุรี 11140
    Click Element    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/form/div[3]/button[2]
    Input Text    xpath=//input[@name='contract_start_date']  2032025
    Input Text    xpath=//input[@name='contract_end_date']  2032025
    Select From List By Value    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/form/div[2]/div[2]/div[1]/div/select    QCManager
    Select From List By Value    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/form/div[2]/div[2]/div[2]/div/select    ตรวจประเมินคุณภาพ
    Select From List By Value    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/form/div[2]/div[3]/div/select    Employee
    # Click Element    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/form/div[3]/button[2]
    [Teardown]    Sleep    10