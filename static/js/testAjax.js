$(function() {
    $.ajax({
        url: '/getImg',
        type: 'GET',
        success: function(res) {
            console.log(res);
        },
        error: function(error) {
            console.log(error);
        }
    });
});