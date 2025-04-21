*** Settings ***
Library           SeleniumLibrary
Library    XML
Library    BuiltIn
Resource          KeyWord.robot
Suite Setup       Open Browser And Maximize
Suite Teardown    Close Browser

# Test Case For Login Page Negative
*** Test Cases ***
Test Login With Invalid Credentials
    [Tags]    LoginNegative
    [Documentation]    Check login with invalid credentials
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/Login/Negative

    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    InvalidLogin1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240008
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    1234567
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    InvalidLogin2.png

    Wait Until Element Is Visible    xpath=//div[contains(@class, "bg-red-50")]//p[contains(text(), "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง")]    timeout=10s
    Capture Page Screenshot    InvalidLogin3.png

# Test Case For Checkin Negative
*** Test Cases ***
Test Checkin Outside Allowed Radius
    [Tags]    CheckinNegative
    [Documentation]    Test case for checkin when outside allowed radius
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/Checkin/Negative

    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    CheckIn1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240010
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    1234567
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    CheckIn2.png

    #เข้าหน้าระบบบันทึกเวลาทำงาน
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/div[1]/a    Checkin3.png

    Set Geolocation    ${GEO_LAT}    ${GEO_LNG}
    Reload Page
    Wait Until Page Contains    ระบบบันทึกเวลาทำงาน    timeout=5s

    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/div[3]/button[1]    Checkin4.png
    Capture Page Screenshot    Checkin5.png

# Test Case For Checkout Negative
Test Checkout Outside Allowed Radius
    [Tags]    CheckoutNegative
    [Documentation]    Test case for checkout when outside allowed radius
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/Checkin/Negative

    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    CheckOut1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240010
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    1234567
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    CheckOut2.png

    #เข้าหน้าระบบบันทึกเวลาทำงาน
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/div[1]/a    CheckOut3.png

    Set Geolocation    ${GEO_LAT}    ${GEO_LNG}
    Reload Page
    Wait Until Page Contains    ระบบบันทึกเวลาทำงาน    timeout=5s

    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/div[3]/button[2]    CheckOut3.png
    Capture Page Screenshot    CheckOut4.png

# # Test Case For Notification Negative
# *** Test Cases ***
# Test Notification Page When No Notification
#     [Tags]    NotificationNegative
#     [Documentation]    Test case for notification page when no notification
#     Set Screenshot Directory    ${EXECDIR}/results/Screenshots/Notification/Negative

#     Go To         ${BASE_URL}
#     Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    Notification1.png
#     Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240001
#     Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    1234567
#     Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    Notification2.png

#     #เข้าหน้าการแจ้งเตือน
#     Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[2]    Notification3.png

#     Wait Until Page Contains Element    xpath=//p[contains(text(), "ไม่มีการแจ้งเตือน")]    timeout=5s
#     Element Should Be Visible    xpath=//p[contains(text(), "ไม่มีการแจ้งเตือน")]
#     Capture Page Screenshot   Notification4.png

#Test Case For WorkInfo Negative
*** Test Cases ***
Test Case For Workinfo Page dropdown
    [Tags]    WorkInfoDropdown
    [Documentation]    Test case for workinfo page when no dropdown selected
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/WorkInfo/Dropdown/Negative

    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    WorkInfoDropDown1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240008
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    WorkInfoDropDown2.png

    #เข้าหน้าบันทึกข้อมูลการทำงาน
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/div[3]/a    WorkInfoDropdown3.png

    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[1]/div[2]/div/input    5
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[2]/div/textarea    test
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[3]/div/input    test

    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[4]/button[2]    WorkInfoDropdown4.png

    # ✅ ตรวจว่า dropdown ยัง invalid
    ${valid}=    Execute JavaScript    return document.querySelector("select").checkValidity();
    Should Be Equal    ${valid}    ${False}

    Capture Page Screenshot   WorkInfoDropdown5.png

Test Case For Workinfo Page Hour
    [Tags]    WorkInfoHours
    [Documentation]    Test case for workinfo page when no hours selected
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/WorkInfo/Hours/Negative

    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    Hours1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240008
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    Hours2.png

    #เข้าหน้าบันทึกข้อมูลการทำงาน
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/div[3]/a    Hours3.png

    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[1]/div[1]/div/select    Hours4.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[1]/div[1]/div/select/option[2]    Hours5.png

    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[2]/div/textarea    test
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[3]/div/input    test

    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[4]/button[2]    Hours6.png

    ${valid}=    Execute JavaScript    return document.querySelector("input").checkValidity();
    Should Be Equal    ${valid}    ${False}

    Capture Page Screenshot    Hours7.png

# Test Case For Request Page Negative
*** Test Cases ***
Test Case For Request Page leaveRequest Type
    [Tags]    LeaveRequestType
    [Documentation]   Test case for request page when no leave type selected
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/Request/LeaveRequest/Type

    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    LeaveRequest1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240008
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    LeaveRequest2.png

    #เข้าหน้าการส่งคำขอ
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/div[4]/a    LeaveRequest3.png

    #ทดสอบโดยไม่กรอกข้อมูลประเภทการลา
    Click And Capture    xpath=//*[@id="formType"]    LeaveRequest4.png
    Click And Capture    xpath=//*[@id="formType"]/option[2]    LeaveRequest5.png

    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[1]    LeaveRequest6.png
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[1]    04/16/2025
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[2]    LeaveRequest7.png
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[2]    04/20/2025
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[3]    LeaveRequest8.png
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[3]    กูจะนอน
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/form/button    LeaveRequest9.png

    # ✅ ตรวจว่า dropdown ยัง invalid
    Should Field Be Invalid    select[name="leave_type"]

    Sleep    5s
    Capture Page Screenshot    LeaveRequest11.png

Test Case For Request Page LeaveRequest StartDate
    [Tags]    LeaveRequestStartDate
    [Documentation]    Test case for request page when no start date selected
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/Request/LeaveRequest/StartDate

    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    StartDate1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240008
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    StartDate2.png

    #เข้าหน้าการส่งคำขอ
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/div[4]/a    StartDate3.png

    #ทดสอบโดยไม่กรอกข้อมูลวันที่เริ่มลา
    Click And Capture    xpath=//*[@id="formType"]    StartDate4.png
    Click And Capture    xpath=//*[@id="formType"]/option[2]    StartDate5.png

    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/select    StartDate6.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/select/option[2]    StartDate7.png

    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[2]    StartDate8.png
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[2]    04/20/2025

    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[3]    StartDate9.png
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[3]    จะนอนนนนนนนนนนนนนนน

    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/form/button    StartDate10.png

    # ✅ ตรวจว่า dropdown ยัง invalid
    Should Field Be Invalid    input[name="start_date"]

Test Case For Request Page LeaveRequest EndDate
    [Tags]    LeaveRequestEndDate
    [Documentation]    Test case for request page when no end date selected
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/Request/LeaveRequest/EndDate

    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    EndDate1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240008
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    EndDate2.png

    #เข้าหน้าการส่งคำขอ
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/div[4]/a    EndDate3.png

    #ทดสอบโดยไม่กรอกข้อมูลวันที่สิ้นสุดลา
    Click And Capture    xpath=//*[@id="formType"]    EndDate4.png
    Click And Capture    xpath=//*[@id="formType"]/option[2]    EndDate5.png

    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/select    EndDate6.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/select/option[2]    EndDate7.png

    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[1]    EndDate8.png
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[1]    04/16/2025 

    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[3]    EndDate9.png
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[3]    จะนอนนนนนนนนนนนนน

    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/form/button    EndDate10.png

    # ✅ ตรวจว่า dropdown ยัง invalid
    Should Field Be Invalid    input[name="end_date"]

Test Case For Request Page LeaveRequest Reason
    [Tags]    LeaveRequestReason
    [Documentation]    Test case for request page when no reason selected
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/Request/LeaveRequest/Reason

    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    Reason1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240008
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    Reason2.png

    #เข้าหน้าการส่งคำขอ
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/div[4]/a    Reason3.png

    #ทดสอบโดยไม่กรอกข้อมูลเหตุผลการลา
    Click And Capture    xpath=//*[@id="formType"]    Reason4.png 
    Click And Capture    xpath=//*[@id="formType"]/option[2]    Reason5.png

    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/select    Reason6.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/select/option[2]    Reason7.png

    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[1]    Reason8.png
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[1]    04/16/2025

    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[2]    Reason9.png
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[2]    04/20/2025

    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/form/button    Reason10.png

    # ✅ ตรวจว่า dropdown ยัง invalid
    Should Field Be Invalid    input[name="reason"]

# Test Case For Settings Page Negative
*** Test Cases ***
Test Case For SettingPage Edit Phone Number
    [Tags]    EditPhoneNumber
    [Documentation]    Test case for setting page when phone number not 10 digits
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/Settings/EditPhoneNumber

    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    EditPhoneNumber1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240008
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    EditPhoneNumber2.png

    #เข้าหน้าการตั้งค่า
    Click And Capture    xpath=/html/body/div/div/div/div[1]/nav/div/div/div[3]/div/div[1]/button    EditPhoneNumber3.png
    Click And Capture    xpath=/html/body/div/div/div/div[1]/nav/div/div/div[3]/div/div[2]/a[2]    EditPhoneNumber4.png
    
    #กรอกข้อมูลเบอร์โทรศัพท์ไม่ครบ10ตัว
    Click And Capture     xpath=//*[@id="root"]/div/div/div[2]/div[1]/div[3]/div/div/button    EditPhoneNumber5.png
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div[1]/div[3]/div/div/input    096827021
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div[1]/div[3]/div/div/button    EditPhoneNumber6.png

    # 🔴 ตรวจสอบว่า Swal เตือนขึ้นมา
    Wait Until Element Is Visible    xpath=/html/body/div[2]/div    timeout=5s
    Element Should Contain    xpath=/html/body/div[2]/div    Failed to update Phone Number.
    Element Should Contain    xpath=/html/body/div[2]/div    หมายเลขโทรศัพท์ต้องมีความยาว 10 ตัว

Test Case For Request Page Edit Address
    [Tags]    EditAddress
    [Documentation]    Test case for setting page when address not filled
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/Settings/EditAddress

    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    EditAddress1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240008
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    EditAddress2.png

    #เข้าหน้าการตั้งค่า
    Click And Capture    xpath=/html/body/div/div/div/div[1]/nav/div/div/div[3]/div/div[1]/button    EditAddress3.png 
    Click And Capture    xpath=/html/body/div/div/div/div[1]/nav/div/div/div[3]/div/div[2]/a[2]    EditAddress4.png

    #ทดสอบเมื่อไม่ได้กรอกข้อมูลที่อยู่
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div[1]/div[4]/div/div/button    EditAddress5.png
    Wait Until Element Is Visible    css:input[name="address"]    timeout=3s
    Execute Javascript
    ...  var el = document.querySelector('input[name="address"]');
    ...  var setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    ...  setter.call(el, '');
    ...  el.dispatchEvent(new Event('input', { bubbles: true }));
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div[1]/div[4]/div/div/button    EditAddress6.png

    # 🔴 ตรวจสอบว่า Swal เตือนขึ้นมา
    Wait Until Element Is Visible    xpath=/html/body/div[2]/div    timeout=5s
    Element Should Contain    xpath=/html/body/div[2]/div    ไม่สามารถบันทึกได้
    Element Should Contain    xpath=/html/body/div[2]/div    กรุณากรอกที่อยู่ก่อนบันทึก

Test Case For Setting Page When Old Password Empty
    [Tags]    OldPasswordEmpty
    [Documentation]    Test case for setting page when old password not filled
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/Settings/OldPasswordEmpty

    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    OldPasswordEmpty1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240008
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    OldPasswordEmpty2.png

    #เข้าหน้าการตั้งค่า
    Click And Capture    xpath=/html/body/div/div/div/div[1]/nav/div/div/div[3]/div/div[1]/button    OldPasswordEmpty3.png
    Click And Capture    xpath=/html/body/div/div/div/div[1]/nav/div/div/div[3]/div/div[2]/a[2]    OldPasswordEmpty4.png

    #กรอกข้อมูลรหัสผ่านเก่าไม่ถูกต้อง
    Click And Capture     xpath=//*[@id="root"]/div/div/div[2]/div[2]/div[2]/input    OldPasswordEmpty5.png
    Input Password    xpath=//*[@id="root"]/div/div/div[2]/div[2]/div[2]/input    1234567

    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div[2]/div[3]/input    OldPasswordEmpty6.png
    Input Password    xpath=//*[@id="root"]/div/div/div[2]/div[2]/div[3]/input    1234567

    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div[2]/div[4]/button    OldPasswordEmpty7.png

    # 🔴 ตรวจสอบว่า Swal เตือนขึ้นมา
    Wait Until Element Is Visible    xpath=/html/body/div[2]/div    timeout=5s
    Element Should Contain    xpath=/html/body/div[2]/div    Failed to update password.
    Element Should Contain    xpath=/html/body/div[2]/div    รหัสผ่านไม่ถูกต้อง.

    Capture Page Screenshot    OldPasswordEmpty8.png
    Sleep    5s

Test Case For Setting Page When New Password Empty
    [Tags]    NewPasswordEmpty
    [Documentation]    Test case for setting page when new password not filled
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/Settings/NewPasswordEmpty

    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    NewPasswordEmpty1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240008
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    NewPasswordEmpty2.png

    #เข้าหน้าการตั้งค่า
    Click And Capture    xpath=/html/body/div/div/div/div[1]/nav/div/div/div[3]/div/div[1]/button    NewPasswordEmpty3.png
    Click And Capture    xpath=/html/body/div/div/div/div[1]/nav/div/div/div[3]/div/div[2]/a[2]    NewPasswordEmpty4.png

    #ไม่ได้กรอกรหัถสผ่านลงไป
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div[2]/div[1]/input    NewPasswordEmpty5.png
    Input Password    xpath=//*[@id="root"]/div/div/div[2]/div[2]/div[1]/input    123456

    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div[2]/div[3]/input    NewPasswordEmpty6.png
    Input Password    xpath=//*[@id="root"]/div/div/div[2]/div[2]/div[3]/input    1234567
    
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div[2]/div[4]/button    NewPasswordEmpty7.png

    # 🔴 ตรวจสอบว่า Swal เตือนขึ้นมา
    Wait Until Element Is Visible    xpath=/html/body/div[2]/div    timeout=5s
    Element Should Contain    xpath=/html/body/div[2]/div    Failed to update password.
    Element Should Contain    xpath=/html/body/div[2]/div    รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร

    Capture Page Screenshot    NewPasswordEmpty8.png
    Sleep    5s

Test Case For Setting Page When Confirm Password Empty
    [Tags]    ConfirmPasswordEmpty
    [Documentation]    Test case for setting page when confirm password not filled
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/Settings/ConfirmPasswordEmpty

    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    ConfirmPasswordEmpty1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240008
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    ConfirmPasswordEmpty2.png

    #เข้าหน้าการตั้งค่า
    Click And Capture    xpath=/html/body/div/div/div/div[1]/nav/div/div/div[3]/div/div[1]/button    ConfirmPasswordEmpty3.png
    Click And Capture    xpath=/html/body/div/div/div/div[1]/nav/div/div/div[3]/div/div[2]/a[2]    ConfirmPasswordEmpty4.png

    #ไม่ได้กรอกรหัสผ่านยืนยันลงไป
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div[2]/div[1]/input    ConfirmPasswordEmpty5.png
    Input Password    xpath=//*[@id="root"]/div/div/div[2]/div[2]/div[1]/input    123456

    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div[2]/div[2]/input    ConfirmPasswordEmpty6.png
    Input Password    xpath=//*[@id="root"]/div/div/div[2]/div[2]/div[2]/input    1234567

    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div[2]/div[4]/button    ConfirmPasswordEmpty7.png

    # 🔴 ตรวจสอบว่า Swal เตือนขึ้นมา
    Wait Until Element Is Visible    xpath=/html/body/div[2]/div    timeout=5s
    Element Should Contain    xpath=/html/body/div[2]/div    Failed to update password.
    Element Should Contain    xpath=/html/body/div[2]/div    รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน



    









