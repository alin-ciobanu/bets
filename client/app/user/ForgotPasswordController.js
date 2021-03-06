
userModule
.controller(
'ForgotPasswordController', [
'$scope', 'InitUrls', 'CallUrlService', '$translate',
function ($scope, InitUrls, CallUrlService, $translate) {

    $scope.inputs = {
        usernameOrEmail: ''
    };

    $scope.status = {
        inProgress: false,
        success: false,
        error: false,
        message: ''
    }

    $scope.forgotPassword = function () {
        $scope.status.inProgress = true;

        InitUrls.then(function (urls) {
            CallUrlService.post({uri: urls.user.forgotPassword},
                {
                    usernameOrEmail: $scope.inputs.usernameOrEmail
                },
                function (data) {
                    $scope.status.success = true;
                    $scope.status.error = false;
                    $scope.status.message = data.message;
                    $scope.status.inProgress = false;
                },
                function (response) {
                    $scope.status.success = false;
                    $scope.status.error = true;
                    if (response.data.message) {
                        $scope.status.message = response.data.message;
                    }
                    else {
                        $scope.status.message = $translate.instant('forgotPasswordPage.errorResponseMessage');
                    }
                    $scope.status.inProgress = false;
                }
            );
        });

    }

}
]
);
