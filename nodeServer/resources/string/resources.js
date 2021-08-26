const messages = {
    user: {
        add: 'User added to the system.',
        confirmEmail: '<p>Welcome to our user management system. You are successfully registered to the system. To activate your account, click on the link below:</p>\
        <p> <a title="activate_link" href="{0}" target="_blank">{0}</p>\
        <p>Thank You</p>\
        <p>Yours Sincere,<br/>The Team</p>',
        activateSuccess: 'User with email {0} activated in the system.',
        deleteSuccess: 'User with id {0} has been deleted from the system',
        updateSuccess: 'User with id {0} has been updated in the system'
    },
    password: {
        changeSuccess: 'Password has been changed.',
        resetLinkEmail: '<div><h3>Employee Time Tracking App</h3></div><div><p>We recieved a password reset request for you account. The password reset link is <div>{0}</div></p>\
        <p>If you have not requested for password reset. Ignore this email.</p><p>Yours Sincere,<br>The Team</p></div>'
    },
    error: {
        user: {
            multipleEmail: 'User exists in the system.',
            usernameUnavailable: 'Username is not available. Please use other username.',
            userNotFoundByEmail: 'Cannot find user registered to our system with email \'{0}\'',
            userNotFoundByUsername: 'Cannot find user registered to our system with username \'{0}\'',
            userNotFoundById: 'Cannot find user registered to our system with id {0}',
            updateActivation: 'Cannot activate user with email \'{0}\'',
            updateDelete: 'Cannot delete user with id {0}',
            updateFailure: 'Cannot update user with id {0}',
            userNotActive: 'User is not active. Please contact your administrator'
        },
        password: {
            confirmationError: 'Re-confirm the passwords. Password do not match.',
            passwordRepeatError: 'Enter a new password. You cannot use last {0} password.',
            usernamePasswordNotMatchError: 'Username or Password is not correct.',
            passwordExpireError: 'Password has reached it\'s maximum life.',
            accountLocked: 'Your account has been locked. Please contact adminstrator.',
            unauthorizedlink: 'The link is incorrect. Please check the link again.',
            oldPasswordNotMatch: 'The old password is not correct'
        },
        authorization: {
            unauthorize: 'The user is not authorized by roles',
            unauthorizeForOp: 'The user is not authorized to perform operation'
        },
        project: {
            create: 'Failed to create project',
            update: 'Failed to update project'
        }
    }
}

module.exports = messages;
