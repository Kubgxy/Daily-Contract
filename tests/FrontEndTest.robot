*** Settings ***
Library           SeleniumLibrary
Resource          KeyWord.robot
Suite Setup       Open Browser And Maximize
Suite Teardown    Close Browser

*** Test Cases ***
Test Login Employee
    [Tags]    LoginEmployee
    [Documentation]    Test Login For Employee
    Set Screenshot Directory    ${EXECDIR}/results/results/Screenshots/Login

    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    Login1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240008
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    Login2.png
    Click And Capture    xpath=/html/body/div/div/div/div[2]    Login3.png

Test Function On ProfilePage
    [Tags]    ProfilePage_Seenotification
    [Documentation]    Test Function On ProfilePage
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/ProfilePage

    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    ProfilePage1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240003
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    ProfilePage2.png
    Click And Capture    xpath=/html/body/div/div/div/div[2]/div/div[2]/div[1]/div/div[2]/div/div[1]/div/button    ProfilePage3.png

# WorkInfo (Positive Case)
*** Test Cases ***
Test Load WorkInfo Page
    [Tags]    WorkInfoLoadPage
    [Documentation]    ทดสอบการโหลดหน้า Work Info ว่าข้อมูลถูกโหลดสำเร็จ พร้อม Navbar และตำแหน่งผู้ใช้งาน
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/WorkInfo/WorkInfoLoadPage

    # Login
    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    WorkInfoLoadPage1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    Admin
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    2209Tnkoak
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    WorkInfoLoadPage2.png

    # เช็คหน้าเพจว่าถูกโหลดสําเร็จ
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[3]    WorkInfoLoadPage3.png
    Element Text Should Be    xpath=//*[@id="root"]/div/div/div[2]/header/div[1]/div[2]/div/h1    Work Info

    # รอหน้าเพจแสดง
    Sleep    1s

    # ถ่ายภาพทั้งหน้า
    Capture Page Screenshot    WorkInfoLoadPage4.png

Test Show Task Options By Position
    [Tags]    WorkInfoDropdown
    [Documentation]    ทดสอบว่าการแสดงรายการงานใน dropdown ตรงกับตำแหน่งของผู้ใช้งาน
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/WorkInfo/WorkInfoDropdown

    # Login
    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    WorkInfoDropdown1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    Admin
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    2209Tnkoak
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    WorkInfoDropdown2.png

    # รอ dropdown ปรากฏ
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[3]    WorkInfoDropdown3.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[1]/div[1]/div/select    WorkInfoDropdown4.png

    # เช็ค dropdown ตามตำแหน่งงาน
    Element Text Should Be    xpath=//select/option[2]    ผลิตสินค้า
    Element Text Should Be    xpath=//select/option[3]    ตรวจสอบคุณภาพเบื้องต้น
    Element Text Should Be    xpath=//select/option[4]    จัดเตรียมวัตถุดิบ
    Element Text Should Be    xpath=//select/option[5]    บำรุงรักษาเครื่องจักร
    Element Text Should Be    xpath=//select/option[6]    จัดเก็บสินค้า

    # คลิก dropdown แล้วกดลูกศรลงให้มันโชว์
    Execute JavaScript    document.querySelector('select').setAttribute('size', '6')

    # รอ dropdown แสดง
    Sleep    1s

    # ถ่ายภาพทั้งหน้า
    Capture Page Screenshot    WorkInfoDropdown5.png

Test Submit Work Record Successfully
    [Tags]    WorkInfoSubmitPositive
    [Documentation]    ทดสอบการกรอกงานและชั่วโมงทำงานที่ถูกต้อง พร้อมกดบันทึกสำเร็จ
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/WorkInfo/WorkInfoSubmitPositive

    # Login
    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    WorkInfoSubmitPositive1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    Admin
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    2209Tnkoak
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    WorkInfoSubmitPositive2.png

    # เข้าหน้า WorkInfo
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[3]    WorkInfoSubmitPositive3.png

    # บันทึกข้อมูลการทำงาน
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[1]/div[1]/div/select    WorkInfoSubmitPositive4.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[1]/div[1]/div/select/option[2]    WorkInfoSubmitPositive5.png
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[1]/div[2]/div/input    7
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[3]/button[2]    WorkInfoSubmitPositive6.png
    Click And Capture    xpath=/html/body/div[2]/div/div[6]/button[1]    WorkInfoSubmitPositive7.png
    Wait Until Element Contains    xpath=//h2[@class='swal2-title']    บันทึกสำเร็จ!    10s

    # ถ่ายภาพทั้งหน้า
    Capture Page Screenshot          WorkInfoSubmitPositive8.png

Test Submit Work With Note
    [Tags]    WorkInfoNoteSubmit
    [Documentation]    ทดสอบการเพิ่มหมายเหตุและตรวจสอบว่าแสดงในประวัติได้ถูกต้อง
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/WorkInfo/WorkInfoNoteSubmit

    # Login
    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    WorkInfoNoteSubmit1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    Admin
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    2209Tnkoak
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    WorkInfoNoteSubmit2.png

    # เข้าหน้า WorkInfo
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[3]    WorkInfoNoteSubmit3.png

    # บันทึกข้อมูลการทำงาน
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[1]/div[1]/div/select    WorkInfoNoteSubmit4.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[1]/div[1]/div/select/option[2]    WorkInfoNoteSubmit5.png
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[1]/div[2]/div/input    7
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[2]/div/textarea    ทดสอบการกรอกงานและชั่วโมงทำงานที่ถูกต้อง
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[3]/button[2]    WorkInfoNoteSubmit6.png
    Click And Capture    xpath=/html/body/div[2]/div/div[6]/button[1]    WorkInfoNoteSubmit7.png
    Wait Until Element Contains    xpath=//h2[@class='swal2-title']    บันทึกสำเร็จ!    10s
    Capture Page Screenshot    WorkInfoNoteSubmit8.png

    # รอให้ Swal หาย
    Sleep    5s

    # เข้าหน้าประวัติการทำงาน
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[1]/button[2]    WorkInfoNoteSubmit9.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/div[2]/div[1]/div[2]/button    WorkInfoNoteSubmit10.png

    # ถ่ายภาพทั้งหน้า
    Capture Page Screenshot          WorkInfoNoteSubmit11.png

Test Switch To Work History Tab
    [Tags]    WorkInfoTabSwitchHistory
    [Documentation]    ทดสอบการกดสลับแท็บไปที่ “ประวัติการทำงาน” แล้วข้อมูลแสดงถูกต้อง
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/WorkInfo/WorkInfoTabSwitchHistory

    # Login
    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    WorkInfoTabSwitchHistory1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    Admin
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    2209Tnkoak
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    WorkInfoTabSwitchHistory2.png

    # เข้าหน้า WorkInfo
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[3]    WorkInfoTabSwitchHistory3.png

    # เข้าหน้าประวัติการทำงาน
    Sleep    1s
    Click Button    xpath=//button[normalize-space(text())='ประวัติการบันทึก']

    # ถ่ายภาพทั้งหน้า
    Capture Page Screenshot          WorkInfoTabSwitchHistory4.png

Test Show Record Details In History
    [Tags]    WorkInfoHistoryDetails
    [Documentation]    ทดสอบการกดปุ่ม “ดูรายละเอียด” ในประวัติแล้วข้อมูลแสดงถูกต้อง
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/WorkInfo/WorkInfoHistoryDetails

    # Login
    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    WorkInfoHistoryDetails1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    Admin
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    2209Tnkoak
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    WorkInfoHistoryDetails2.png

    # เข้าหน้า WorkInfo
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[3]    WorkInfoHistoryDetails3.png

    # เข้าหน้าประวัติการทำงาน
    Sleep    1s
    Click Button    xpath=//button[normalize-space(text())='ประวัติการบันทึก']
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/div[2]/div[1]/div[2]/button    WorkInfoHistoryDetails4.png

    # ถ่ายภาพทั้งหน้า
    Capture Page Screenshot          WorkInfoHistoryDetails5.png

Test Show Tooltip Guidance
    [Tags]    WorkInfoTooltipUI
    [Documentation]    ทดสอบการแสดง Tooltip แนะนำเมื่อกดที่ไอคอน และสามารถปิด/เปิดได้
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/WorkInfo/WorkInfoTooltipUI

    # Login
    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    WorkInfoTooltipUI1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    Admin
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    2209Tnkoak
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    WorkInfoTooltipUI2.png

    # เข้าหน้า WorkInfo
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[3]    WorkInfoTooltipUI3.png

    # รอ tooltip icon ปรากฏแบบเจาะจง
    Wait Until Element Is Visible    css=svg.lucide.lucide-circle-alert    timeout=10s

    # คลิก icon tooltip
    Click Element    css=svg.lucide.lucide-circle-alert

    # รอผล tooltip แสดง
    Sleep    1s
    Capture Page Screenshot    WorkInfoTooltipUI4.png