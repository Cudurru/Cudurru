# stages

DOMAIN="localhost:8080"
REFRESH_DB=0
CREATE_USER=0
ACTIVATE_USER=0
LOGIN_USER=1
GET_AUTH=1
SEND_RESET_EMAIL=0
RESET_PASSWORD=0
CLEANUP=0

set -e 
clear
printf '\e[3J'

echo
echo "[ Running Tests ]"
echo 

EMAIL="seth@doercreator.com"

header() {
    printf "============= ${1} ============ \n"
}

run_sql() {
    echo
    psql --quiet -d overture -c "\x on" -c "${1}"
}
run_sql_get() {
    local RESULT=$(run_sql "${1}" | grep "^${2} " | awk '{ print $3 }')
    echo $RESULT
}


get() {
    printf "\033[34m"
    printf "GET /${1}"
    printf "\033[0m\n"
    echo 
    curl "${DOMAIN}/${1}"
}

curl_api() {
    printf "\033[34m"
    printf "${2} /${1}"
    printf "\033[0m\n"
    printf "payload: ${3}"
    echo 
    curl "${DOMAIN}/${1}" -X ${2} -H "Content-Type: application/json" \
        -d "${3}" 
    echo
}
if [ $REFRESH_DB == 1 ]; then
    header "Refresh database"
    set +e
    # header "drop users"
    #alembic downgrade -1
    set -e
    alembic upgrade head
fi

if [ $CREATE_USER == 1 ]; then
    header "create a new user"
    curl_api "register" "POST" "{\"email\": \"seth@doercreator.com\", \"username\":\"sethismyname\",\"password\":\"test1234\" }"
    curl_api "register" "POST" "{\"email\": \"seth@doercreator.com\", \"username\":\"sethismyname\",\"password\":\"test1234\" }"
fi

USER_ID=$(run_sql_get "SELECT * FROM users limit 1;" "id")
USER_EMAIL=$(run_sql_get "SELECT * FROM users limit 1;" "email")
REGISTRATION_CODE=$(run_sql_get "SELECT * FROM registration_codes where email= '${USER_EMAIL}' and deactivated_date is NULL limit 1;"  "code") 

if [ $ACTIVATE_USER == 1 ]; then
    header "activate user"
    curl_api "register" "PATCH" "{\"code\": \"${REGISTRATION_CODE}\" }"
fi

#header "users"
#run_sql "SELECT * FROM users;"

if [ $LOGIN_USER == 1 ]; then
    header "login user"
    TOKEN=$(curl -s -i "localhost:8080/login" -X POST -H "Content-Type: application/json" -d "{\"username\":\"sethismyname\",\"password\":\"test1234\" }" | grep X-Jwt | awk '{ print $2 }')
    echo "token ${TOKEN}"
    # {"success": 1, "jwt": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MX0.XS63uH5LaKIVBA4S88rVAe6m5zGVtr6AyJpC-L1NvXc"}

fi

if [ $GET_AUTH == 1 ]; then
    header "get auth"
    curl -i "${DOMAIN}/admin" -H "Authorization: Bearer ${TOKEN}"  
    echo
    sleep 1
    curl -i "${DOMAIN}/admin" -H "Authorization: Bearer ${TOKEN}"  
    echo
fi

if [ $SEND_RESET_EMAIL == 1 ]; then
    header "create reset code"
    curl_api "resetpassword" "PATCH" "{\"email\":\"seth@doercreator.com\"}"
    run_sql "SELECT * FROM users where id = ${USER_ID};"
    RESET_CODE=$(run_sql_get "SELECT * FROM users where id= '${USER_ID}' limit 1;"  "reset_code") 
    echo "reset code: '${RESET_CODE}'"
    echo "email: '${EMAIL}'"
fi

if [ $RESET_PASSWORD == 1 ]; then
    header "reset password"
    curl_api "resetpassword" "POST" "{\"reset_code\": \"${RESET_CODE}\", \"password\": \"newpasswordhere\", \"password_confirm\":\"newpasswordhere\"}"
    run_sql "SELECT * FROM users where id = ${USER_ID};"
fi


if [ $CLEANUP == 1 ]; then
    header "cleanup"
    run_sql "delete FROM user_roles;"
    run_sql "delete FROM registration_codes;"
    run_sql "delete FROM registrations;"
    run_sql "delete FROM users;"
	echo
fi


echo "[ Done Running Tests ]"
