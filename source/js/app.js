define([
    'lib/news_special/bootstrap',
    'backbone',
    'lib/vendors/bind.polyfill.js',
    'models/user',
    'views/userForm'
], function (news, Backbone, BindPolyfill, UserModel, UserForm) {

    var mainEl = news.$('.main');

    var userModel = new UserModel();
    var userForm = new UserForm({
        container: mainEl.find('.user-form-wrapper'),
        model: userModel
    });
    userForm.render();

    news.sendMessageToremoveLoadingImage();

});