window.onload = function() {
    s = new io.Socket(window.location.hostname, {port: 8001, rememberTransport: false, resource: 'input',});
    s.connect();

    s.addEvent('connect', function() {
        s.send('New participant joined');
    });

    //send the message when submit is clicked
    /*$('#chatform').submit(function (evt) {
        var line = $('#chatform [type=text]').val()
        $('#chatform [type=text]').val('')
        s.send(line);
        return false;
    });*/
};