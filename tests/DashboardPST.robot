*** Settings ***
Library           SeleniumLibrary
Library    XML
Resource          KeyWord.robot
Suite Setup       Open Browser And Maximize
Suite Teardown    Close Browser

*** Variables ***
${IMAGE_PATH}        ${EXECDIR}/tests/uploads/Avatar1.jpeg
${AVATAR_INPUT}      //label/input[@type="file"]

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

# Test Case For Dashbord Page Admin
*** Test Cases ***
Test Case For Dashbord Page Admin
    [Tags]    DashboardPageAdmin
    [Documentation]    Dashboard Should Display All Summary Sections
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/Admin/Dashboard/Positive

    Go To    ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[2]    DashboardPass1.png
    Input Text    xpath=//*[@id="username"]    20240001
    Input Password    xpath=//*[@id="password"]    1234567
    Click And Capture    xpath=//*[@id="root"]/div/div/div/main/div/div/div/div/form/button    DashboardPass2.png

    #ทำการเช็คว่าข้อมูลถูกโหลดบนหน้า Dashboard หรือไม่
    Wait Until Page Contains    แดชบอร์ดระบบการทำงาน - แอดมิน

    #ทำการเช็คว่าการ์ดด้านบนสุดมีการแสดงผลหรือไม่
    Page Should Contain    มาทำงานวันนี้
    Page Should Contain    ลางาน
    Page Should Contain    คำขอ OT
    Page Should Contain    คำขอต่อสัญญา
    
    # ทำการเช็คว่าตรงคำขอล่าสุดมีการแสดงผลหรือไม่
    Page Should Contain    คำขอล่าสุด
    Page Should Contain    Approved
    Page Should Contain    Pending
    Page Should Contain    Rejected

    # ทำการเช็คว่าตรงสรุปการทำงานมีการแสดงผลหรือไม่
    Page Should Contain    สรุปการทำงานประจำวัน
    Page Should Contain    พนักงานมาทำงาน
    Page Should Contain    พนักงานลางาน
    Page Should Contain    คำขอทำงานล่วงเวลา

    Sleep    1s
    Capture Page Screenshot    DashboardPass3.png

# Test Case For Profile Page Admin
*** Test Cases ***
Test Case For Upload Avatar
    [Tags]    UploadAvatar
    [Documentation]    Upload Avatar Image On Profile Page
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/Admin/Profile/UploadAvatar/Positive

    Go To    ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[2]    UploadAvatarPass1.png
    Input Text    xpath=//*[@id="username"]    20240001
    Input Password    xpath=//*[@id="password"]    1234567
    Click And Capture    xpath=//*[@id="root"]/div/div/div/main/div/div/div/div/form/button    UploadAvatarPass2.png

    #ทำการแก้ไขข้อมูลบน Profile Page
    Click And Capture    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[1]/a[1]    UploadAvatarPass3.png

    Wait Until Page Contains Element    ${AVATAR_INPUT}    timeout=10s
    Execute JavaScript    document.querySelector('input[type="file"]').removeAttribute('hidden');
    Choose File    ${AVATAR_INPUT}    ${IMAGE_PATH}

    Sleep    2s
    Capture Page Screenshot    UploadAvatarPass3.png

    Reload Page
    Sleep    2s

    Capture Page Screenshot    UploadAvatarPass4.png

Test Case For Edit Phone Number
    [Tags]    EditPhoneNumber
    [Documentation]    Edit Phone Number On Profile Page
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/Admin/Profile/EditPhoneNumber/Positive

    Go To    ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[2]    EditPhoneNumberPass1.png
    Input Text    xpath=//*[@id="username"]    20240001
    Input Password    xpath=//*[@id="password"]    1234567
    Click And Capture    xpath=//*[@id="root"]/div/div/div/main/div/div/div/div/form/button    EditPhoneNumberPass2.png

    #เข้าหน้า Profile Page
    Click And Capture    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[1]/a[1]    EditPhoneNumberPass3.png

    #ทำการแก้ไขเบอร์โทรศัพท์
    Click And Capture    xpath=//*[@id="root"]/div/div/div/main/div/div/div[2]/div[1]/button    EditPhoneNumberPass4.png
    Input Text    xpath=//*[@id="root"]/div/div/div/main/div/div/div[2]/div[2]/div[2]/input    0823615461

    Click And Capture    xpath=//*[@id="root"]/div/div/div/main/div/div/div[2]/div[2]/div[6]/button    EditPhoneNumberPass5.png

    Sleep    2s
    Capture Page Screenshot    EditPhoneNumberPass6.png

Test Case For Edit Address
    [Tags]    EditAddress
    [Documentation]    Edit Address On Profile Page
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/Admin/Profile/EditAddress/Positive

    Go To    ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[2]    EditAddressPass1.png
    Input Text    xpath=//*[@id="username"]    20240001
    Input Password    xpath=//*[@id="password"]    1234567
    Click And Capture    xpath=//*[@id="root"]/div/div/div/main/div/div/div/div/form/button    EditAddressPass2.png

    #เข้าหน้า Profile Page
    Click And Capture    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[1]/a[1]    EditAddressPass3.png

    #ทำการแก้ไขที่อยู่
    Click And Capture    xpath=//*[@id="root"]/div/div/div/main/div/div/div[2]/div[1]/button    EditAddressPass4.png
    Input Text    xpath=//*[@id="root"]/div/div/div/main/div/div/div[2]/div[2]/div[3]/textarea    พระนั่งเกล้า
    
    Click And Capture    xpath=//*[@id="root"]/div/div/div/main/div/div/div[2]/div[2]/div[6]/button    EditAddressPass5.png

    Sleep    2s
    Capture Page Screenshot    EditAddressPass6.png

# Test Case For Register Employee
*** Test Cases ***
Test Case For Register Step1 By Admin
    [Tags]    RegisterStep1
    [Documentation]    Register Step1 By Admin
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/Admin/Profile/Register/Step1/Positive

    Go To    ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[2]    RegisterStepOnePass1.png
    Input Text    xpath=//*[@id="username"]    20240001
    Input Password    xpath=//*[@id="password"]    1234567
    Click And Capture    xpath=//*[@id="root"]/div/div/div/main/div/div/div/div/form/button    RegisterStepOnePass2.png

    #เข้าหน้า Register Page
    Click And Capture    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[1]/a[3]    RegisterStepOnePass3.png

    #ทำการกรอกข้อมูล Step 1 ลงในฟอร์ม Register
    Input Password    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/form/div[2]/div/div[1]/div/input    123456
    Input Password    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/form/div[2]/div/div[2]/div/input    123456

    Click And Capture    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/form/div[2]/div/div[1]/div/input    RegisterStepOnePass4.png

    Sleep    2s
    Capture Page Screenshot    RegisterStepOnePass5.png

Test Case For Register Step2 By Admin
    [Tags]    RegisterStep2
    [Documentation]    Register Step2 By Admin
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/Admin/Profile/Register/Step2/Positive

    Go To    ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[2]    RegisterStepTwoPass1.png
    Input Text    xpath=//*[@id="username"]    20240001
    Input Password    xpath=//*[@id="password"]    1234567
    Click And Capture    xpath=//*[@id="root"]/div/div/div/main/div/div/div/div/form/button    RegisterStepTwoPass2.png

    #เข้าหน้า Register Page
    Click And Capture    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[1]/a[3]    RegisterStepTwoPass3.png

    #ทำการกรอกข้อมูล Step 1 ลงในฟอร์ม Register
    Input Password    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/form/div[2]/div/div[1]/div/input    123456
    Input Password    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/form/div[2]/div/div[2]/div/input    123456

    Click And Capture    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/form/div[3]/button    RegisterStepTwoPass4.png
    Sleep    2s

    #ทำการกรอกข้อมูล Step 2 ลงในฟอร์ม Register 
    Input Text    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/form/div[2]/div[1]/div[1]/input    Test
    Input Text    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/form/div[2]/div[1]/div[2]/input    Caseeeeeeee

    Input Text    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/form/div[2]/div[2]/div/input    testcase@gmail.com

    Input Text    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/form/div[2]/div[3]/div/input    0912345678

    Input Text    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/form/div[2]/div[4]/textarea    พระนั่งเกล้า

    Click And Capture    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/form/div[3]/button[2]    RegisterStepTwoPass6.png

    Sleep    2s
    Capture Page Screenshot    RegisterStepTwoPass7.png

Test Case For Register Step3 By Admin
    [Tags]    RegisterStep3
    [Documentation]    Register Step3 By Admin
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/Admin/Profile/Register/Step3/Positive

    Go To    ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[2]    RegisterStepThreePass1.png
    Input Text    xpath=//*[@id="username"]    20240001
    Input Password    xpath=//*[@id="password"]    1234567
    Click And Capture    xpath=//*[@id="root"]/div/div/div/main/div/div/div/div/form/button    RegisterStepThreePass2.png

    #เข้าหน้า Register Page
    Click And Capture    xpath=//*[@id="root"]/div/div/aside/div/div[2]/div[1]/a[3]    RegisterStepThreePass3.png

    #ทำการกรอกข้อมูล Step 1 ลงในฟอร์ม Register
    Input Password    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/form/div[2]/div/div[1]/div/input    123456
    Input Password    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/form/div[2]/div/div[2]/div/input    123456

    Click And Capture    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/form/div[3]/button    RegisterStepThreePass4.png
    Sleep    2s

    #ทำการกรอกข้อมูล Step 2 ลงในฟอร์ม Register
    Input Text    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/form/div[2]/div[1]/div[1]/input    Test
    Input Text    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/form/div[2]/div[1]/div[2]/input    Caseeeeeeee

    Input Text    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/form/div[2]/div[2]/div/input    testcase@gmail.com

    Input Text    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/form/div[2]/div[3]/div/input    0912345678

    Input Text    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/form/div[2]/div[4]/textarea    พระนั่งเกล้า

    Click And Capture    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/form/div[3]/button[2]    RegisterStepThreePass6.png
    Sleep    2s

    #ทำการกรอกข้อมูล Step 3 ลงในฟอร์ม Register
    Execute JavaScript    document.querySelector('input[name="contract_start_date"]').value = '2025-04-20'
    Execute JavaScript    document.querySelector('input[name="contract_start_date"]').dispatchEvent(new Event('change', { bubbles: true }))

    Execute JavaScript    document.querySelector('input[name="contract_end_date"]').value = '2025-10-20'
    Execute JavaScript    document.querySelector('input[name="contract_end_date"]').dispatchEvent(new Event('change', { bubbles: true }))

    Sleep    5s
    Capture Page Screenshot    RegisterStepThreePass16.png

    Click And Capture    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/form/div[2]/div[2]/div[1]/div/select    RegisterStepThreePass7.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/form/div[2]/div[2]/div[1]/div/select/option[4]    RegisterStepThreePass8.png

    Click And Capture    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/form/div[2]/div[2]/div[2]/div/select    RegisterStepThreePass9.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/form/div[2]/div[2]/div[2]/div/select/option[3]    RegisterStepThreePass10.png
    
    Click And Capture    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/form/div[2]/div[3]/div/select    RegisterStepThreePass11.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/form/div[2]/div[3]/div/select/option[2]    RegisterStepThreePass12.png

    #อัพโหลดไฟล์ avatar
    Click And Capture    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/form/div[2]/div[4]/div/label    RegisterStepThreePass13.png

    Wait Until Page Contains Element    ${AVATAR_INPUT}    timeout=10s
    Execute JavaScript    document.querySelector('input[type="file"]').removeAttribute('hidden');
    Choose File    ${AVATAR_INPUT}    ${IMAGE_PATH}
    
    Sleep    2s

    Click And Capture    xpath=//*[@id="root"]/div/div/div/main/div/div[2]/form/div[3]/button[2]    RegisterStepThreePass14.png

    Click And Capture    xpath=//*[@id="root"]/div/div/div/main/div/div[3]/div/div[2]/div[2]/button[1]    RegisterStepThreePass15.png

    Click And Capture    xpath=//*[@id="root"]/div/div/div/main/div/div[3]/div/div[2]/div[2]/button    RegisterStepThreePass16.png

    Sleep    5s
    Capture Page Screenshot    RegisterStepThreePass17.png

