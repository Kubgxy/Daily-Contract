*** Settings ***
Library  SeleniumLibrary

*** Variables ***
${BROWSER}  chrome
${URL}  http://localhost:5173

*** Test Cases ***
Register
    [Tags]  Register
    Open Browser  ${URL}  ${BROWSER}
    Maximize Browser Window
    Click Element    xpath=//*[@id="root"]/div/div/div/div/div[2]/p
    Input Text    username    20240001
    Input Password    password    zz123456
    Click Element    xpath=//*[@id="root"]/div/div/div/main/div/div/div/div/form/button

    Wait Until Element Is Visible    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[1]/a[2]
    Click Element    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[1]/a[2]
    Input Password    password    Fourthzxx1
    Input Password    re_password    Fourthzxx1
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

Employee
    [Tags]  Employee
    Open Browser  ${URL}  ${BROWSER}
    Maximize Browser Window
    Click Element    xpath=//*[@id="root"]/div/div/div/div/div[2]/p
    Input Text    username    20240001
    Input Password    password    zz123456
    Click Element    xpath=//*[@id="root"]/div/div/div/main/div/div/div/div/form/button

    Wait Until Element Is Visible    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[2]/button[1]
    Click Element    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[2]/button[1]
    Click Element    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[2]/div/a[1]
    Click Element    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/div/table/tbody/tr[1]/td[5]/button[2]
    [Teardown]    Sleep    10

AssignWork
    [Tags]  AssignWork
    Open Browser  ${URL}  ${BROWSER}
    Maximize Browser Window
    Click Element    xpath=//*[@id="root"]/div/div/div/div/div[2]/p
    Input Text    username    20240001
    Input Password    password    zz123456
    Click Element    xpath=//*[@id="root"]/div/div/div/main/div/div/div/div/form/button

    Wait Until Element Is Visible    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[2]/button[1]
    Click Element    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[2]/button[1]
    Wait Until Element Is Visible    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[2]/div/a[2]
    Click Element    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[2]/div/a[2]
    Wait Until Element Is Visible    xpath=//*[@id="root"]/div/div/div/main/div/div[1]/div/button
    Click Element    xpath=//*[@id="root"]/div/div/div/main/div/div[1]/div/button
    Input Text    title    ทำงาน CSI402,403
    Input Text    description    ทำงานวันสุดท้าย
    Select From List By Value    xpath=//*[@id="assigned_to"]    พนักงานฝ่ายผลิต
    Select From List By Value    xpath=//*[@id="priority"]    High
    Input Text    estimated_time    24
    Execute JavaScript  document.querySelector('input[type="date"]').value = '2025-03-23';
    Click Element    xpath=//*[@id="root"]/div/div/div/main/div/div[5]/div/div[2]/div/form/div[2]/button[2]
    [Teardown]    Sleep    10

Notification
    [Tags]  Notification
    Open Browser  ${URL}  ${BROWSER}
    Maximize Browser Window
    Click Element    xpath=//*[@id="root"]/div/div/div/div/div[2]/p
    Input Text    username    20240001
    Input Password    password    zz123456
    Click Element    xpath=//*[@id="root"]/div/div/div/main/div/div/div/div/form/button

    Wait Until Element Is Visible    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[2]/a[1]
    Click Element    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[2]/a[1]
    Select From List By Value    xpath=//*[@id="category"]    general
    Input Text    message    ทำงานวันสุดท้าย
    Input Text    details    แล้วเราเจอกันใหม่พรรคพวก
    Click Element    xpath=//*[@id="root"]/div/div/div/main/div/div/div[1]/div/div/button
    [Teardown]    Sleep    10

Checkin-out
    [Tags]  Checkin-out
    Open Browser  ${URL}  ${BROWSER}
    Maximize Browser Window
    Click Element    xpath=//*[@id="root"]/div/div/div/div/div[2]/p
    Input Text    username    20240001
    Input Password    password    zz123456
    Click Element    xpath=//*[@id="root"]/div/div/div/main/div/div/div/div/form/button

    Wait Until Element Is Visible    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[2]/a[2]
    Click Element    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[2]/a[2]
    [Teardown]    Sleep    10

Request
    [Tags]  Request
    Open Browser  ${URL}  ${BROWSER}
    Maximize Browser Window
    Click Element    xpath=//*[@id="root"]/div/div/div/div/div[2]/p
    Input Text    username    20240001
    Input Password    password    zz123456
    Click Element    xpath=//*[@id="root"]/div/div/div/main/div/div/div/div/form/button

    Wait Until Element Is Visible    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[2]/button[2]
    Click Element    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[2]/button[2]
    Click Element    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[2]/div/a[1]
    Click Element    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/div/table/tbody/tr[2]/td[5]/div/button[1]
    [Teardown]    Sleep    10

LeaveRequest
    [Tags]  LeaveRequest
    Open Browser  ${URL}  ${BROWSER}
    Maximize Browser Window
    Click Element    xpath=//*[@id="root"]/div/div/div/div/div[2]/p
    Input Text    username    20240001
    Input Password    password    zz123456
    Click Element    xpath=//*[@id="root"]/div/div/div/main/div/div/div/div/form/button

    Wait Until Element Is Visible    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[2]/button[2]
    Click Element    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[2]/button[2]
    Click Element    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[2]/div/a[2]
    [Teardown]    Sleep    10

Overtime
    [Tags]  Overtime
    Open Browser  ${URL}  ${BROWSER}
    Maximize Browser Window
    Click Element    xpath=//*[@id="root"]/div/div/div/div/div[2]/p
    Input Text    username    20240001
    Input Password    password    zz123456
    Click Element    xpath=//*[@id="root"]/div/div/div/main/div/div/div/div/form/button

    Wait Until Element Is Visible    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[2]/button[2]
    Click Element    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[2]/button[2]
    Click Element    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[2]/div/a[3]
    [Teardown]    Sleep    10

Workinfo
    [Tags]  Workinfo
    Open Browser  ${URL}  ${BROWSER}
    Maximize Browser Window
    Click Element    xpath=//*[@id="root"]/div/div/div/div/div[2]/p
    Input Text    username    20240001
    Input Password    password    zz123456
    Click Element    xpath=//*[@id="root"]/div/div/div/main/div/div/div/div/form/button

    Wait Until Element Is Visible    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[2]/a[3]
    Click Element    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[2]/a[3]
    [Teardown]    Sleep    10

Workreport
    [Tags]  Workreport
    Open Browser  ${URL}  ${BROWSER}
    Maximize Browser Window
    Click Element    xpath=//*[@id="root"]/div/div/div/div/div[2]/p
    Input Text    username    20240001
    Input Password    password    zz123456
    Click Element    xpath=//*[@id="root"]/div/div/div/main/div/div/div/div/form/button

    Wait Until Element Is Visible    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[2]/a[4]
    Click Element    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[2]/a[4]
    [Teardown]    Sleep    10

Profile
    [Tags]  Profile
    Open Browser  ${URL}  ${BROWSER}
    Maximize Browser Window
    Click Element    xpath=//*[@id="root"]/div/div/div/div/div[2]/p
    Input Text    username    20240001
    Input Password    password    zz123456
    Click Element    xpath=//*[@id="root"]/div/div/div/main/div/div/div/div/form/button

    Wait Until Element Is Visible    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[3]/a
    Click Element    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[3]/a
    Click Element    xpath=//*[@id="root"]/div/div/div/main/div/div/div[2]/div[1]/button
    Input Text    phone_number    0858294254
    Input Text    address    99/88 ต.บางแม่นาง อ.บางใหญ่ จ.นนทบุรี 11140
    [Teardown]    Sleep    10

Logout
    [Tags]  Logout
    Open Browser  ${URL}  ${BROWSER}
    Maximize Browser Window
    Click Element    xpath=//*[@id="root"]/div/div/div/div/div[2]/p
    Input Text    username    20240001
    Input Password    password    zz123456
    Click Element    xpath=//*[@id="root"]/div/div/div/main/div/div/div/div/form/button

    Wait Until Element Is Visible    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[3]/button
    Click Element    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[3]/button
    [Teardown]    Sleep    10