userModule
.controller('RegisterController', [
'$scope', 'InitUrls', 'CallUrlService', 'SaltGenerator', 'SHA-2',
function ($scope, InitUrls, CallUrlService, SaltGenerator, SHA2) {

    $scope.inputs = {
        username: {
            model: '',
            error: false
        },
        password: {
            model: '',
            error: false
        },
        confirmPassword: {
            model: '',
            error: false
        },
        email: {
            model: '',
            error: false
        },
        birthDate: {
            model: null,
            error: false
        }
    };

    $scope.status = {
        inProgress: false,
        success: false,
        error: false,
        message: ''
    };

    var resetStatus = function () {
        $scope.status.success = false;
        $scope.status.error = false;
        $scope.status.message = '';
    }

    var resetInputsError = function () {
        $scope.inputs = _.object(_.map($scope.inputs, function (item, key) {
            item.error = false;
            return [key, item];
        }));
    }

    $scope.register = function () {

        resetStatus();
        resetInputsError();

        $scope.status.inProgress = true;

        InitUrls.then(function (data) {
            var urls = data;

            var accountData = _.object(_.map($scope.inputs, function (item, key) {
                return [key, item.model];
            }));

            accountData.salt = SaltGenerator.generate();
            accountData.password = SHA2.sha256(accountData.password + accountData.salt);
            accountData.confirmPassword = SHA2.sha256(accountData.confirmPassword + accountData.salt);

            CallUrlService.post({uri: urls.user.address}, accountData,
            function (data) {
                $scope.status.success = true;
                $scope.status.message = "Your account was successfully created. " +
                    "An activation code will be e-mailed to you shortly.";
                $scope.status.inProgress = false;
            },
            function (response) {

                response = response.data;
                $scope.status.error = true;

                if (response.name == "ValidationError") {
                    // mongoose validation
                    $scope.status.message = 'Account wasn\'t created. Highlighted fields are required.';

                    for (var i in response.errors) {
                        $scope.inputs[i].error = true;
                    }

                    if ($scope.inputs.password.error) {
                        $scope.inputs.confirmPassword.error = true;
                    }

                }
                else {
                    $scope.status.message = response.message;

                    $scope.inputs.username.error = response.errorFields.username;
                    $scope.inputs.email.error = response.errorFields.email;

                }

                $scope.status.inProgress = false;

            }
            );

        });
    }

    $scope.dateOptions = {
        changeYear: true,
        changeMonth: true,
        yearRange: '1940:-0'
    };

}]);