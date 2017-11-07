exports.foo = function() { return 'FOO!'; };
exports.bar = function() { return 'BAR!'; };
exports.yell = function (msg) { return msg.toUpperCase(); };
exports.goo = function() { return '<script> var email="tracy@abc.com"; console.log(email); </script>';};
exports.script_data = function() { return '<script> var signinCredential = {email: "allen.nie@mottmac.com", password: "12345678" };</script>';};