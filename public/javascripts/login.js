const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
});



function Validator(options) {
    var formElement = document.querySelector(options.form)

    if (formElement) {
        options.rules.forEach(function (rule) {
            var inputElement = formElement.querySelector(rule.selector)
            // xử lý validate
            validate(inputElement, rule, options)

        })
    }

}

function validate(inputElement, rule, options) {
    var check = 0
    // chỉ đến phần in ra lỗi 
    // nếu inputElement có tồn tại
    if (inputElement) {
        // xử lý blur ra khỏi input
        inputElement.onblur = function () {
            // lấy giá trị từ input và kiểm tra có hợp lệ hay không
            var errorMessage = rule.test(inputElement.value)

            // nếu có lỗi thì in ra thông báo lỗi
            if (errorMessage) {
                check = 1
                inputElement.parentElement.classList.add('invalid')
            } else {
                inputElement.parentElement.classList.remove('invalid')
            }

        }

        // xử lý mỗi khi người dùng nhập
        inputElement.oninput = function () {
            inputElement.parentElement.classList.remove('invalid')
        }

    }

    return check

}

Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        // kiểm tra giá trị nhập vào có hợp lệ không
        test: function (value) {
            return value.trim() ? undefined : message
        }
    }
}

Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            // kiểm tra chuẩn của email
            var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            return regex.test(value) ? undefined : message

        }
    }
}

Validator.isMinLen = function (selector, message) {
    return {
        selector: selector,
        // kiểm tra giá trị nhập vào có hợp lệ không
        test: function (value) {
            return value.length >= 6 ? undefined : message
        }
    }
}

