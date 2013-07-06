/*
 CoW namespace
 */

(function(cow, undefined) {

    // Private variables
    
    // Public Variables
    cow.codeMirror = null;

    // Public method
    cow.init = function(settings) {
        console.log('Cow init:', settings);
        if (settings.codeMirror)
            cow.codeMirror = settings.codeMirror;

        //
        cow.setup();
    };
    cow.setup = function( ) {

        if (goinstant) {
            var url = 'https://goinstant.net/co-web-dev/cow-dev/getstarted';
            goinstant.connect(url, function(err, platform, session) {
                if (err) {
                    console.log('error connecting');
                    return;
                }

                if (cow.codeMirror) {
                    var codeMirror = cow.codeMirror;
                    var codeKey = session.key('/code');
                    var currentCode = null;
                    
                    // Update the Code Mirror contents
                    function updateCode(value) {
                        var anchor = codeMirror.getCursor(true), head = codeMirror.getCursor(false); // Backup original selection position
                        codeMirror.setValue(value); // Set new value / contents
                        codeMirror.setSelection(anchor, head);  // Restore selection position
                        codeMirror.setCursor(head.line, head.ch); // Restore cursor position
                        currentCode = value;
                    };
                    
                    // handle sets from remote users
                    codeKey.on('set', function(value, context) {
                        updateCode(value);
                    });

                    // set the value when we load
                    codeKey.get(function(err, value, context) {
                        updateCode(value);
                    });

                    function setCode() {
                        var value = codeMirror.getValue();
                        
                        codeKey.set(value);
                    }
                    
                    // Setup Code Mirror
                    codeMirror.on('change', function(event, instance, changeObj) {
                        // console.log(event, instance, changeObj);
                        // setCode();
                    });
                    
                }
            });
        } else {
            console.log('Error: GoInstant API not installed.');
        }

    };

})(window.cow = window.cow || {});