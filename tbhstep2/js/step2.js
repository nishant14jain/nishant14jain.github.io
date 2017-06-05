function toggleState(x) {
    if (x == 1) {
        $('.textinput-wrapper').addClass('active');
        $('.triggerTextarea').hide();
        $('#step2Textarea').focus();
    }
    if (x == 0) {
        $('.textinput-wrapper').removeClass('active');
        $('.triggerTextarea').show();
        var dictContent = '<img class="svg" height="50" src="icons/1_1_All_in_one-01.svg">';
        dictContent += '<p>Drop or Upload your files here!</p>';
        dictContent += '<small><strong>(Upto 25 files, max 15MB each.)</strong></small>'
        $('.dz-message').html(dictContent);
        $('#step2 .drop-wrapper').removeClass('active');
        $('#step2 .dropzone .dz-message').show();
        $('#step2 .drop-files-stat').hide();
    }
    if (x == 2) {
        $('.dz-message').hide();
        $('#step2 .drop-wrapper').addClass('active');
        $('#step2 .drop-files-stat').show();
    }
}
function clearTextarea() {
    $('#step2Textarea').val('');
    $('#step2Textarea').focus();
}
counter = function () {
    var value = $('#step2Textarea').val();
    if (value.length == 0) {
        $('#wordCount').html(0);
        return;
    }
    var regex = /\s+/gi;
    var wordCount = value.trim().replace(regex, ' ').split(' ').length;
    $('#wordCount').html(wordCount);
};
$(document).ready(function () {
    $('#step2Textarea').change(counter);
    $('#step2Textarea').keydown(counter);
    $('#step2Textarea').keypress(counter);
    $('#step2Textarea').keyup(counter);
    $('#step2Textarea').blur(counter);
    $('#step2Textarea').focus(counter);
    toggleState(0);
});


//--------------

Dropzone.autoDiscover = false;
// Get the template HTML and remove it from the doumenthe template HTML and remove it from the doument
var previewNode = document.querySelector("#template");
previewNode.id = "";
var previewTemplate = previewNode.parentNode.innerHTML;
previewNode.parentNode.removeChild(previewNode);

var myDropzone = new Dropzone('#myDropzone', {// Make the whole body a dropzone
    url: "/localhost", // Set the url
    thumbnailWidth: 80,
    thumbnailHeight: 80,
    parallelUploads: 20,
    previewTemplate: previewTemplate,
    autoQueue: false, // Make sure the files aren't queued until manually added
    previewsContainer: "#previews", // Define the container to display the previews
    clickable: "#myDropzone", // Define the element that should be used as click trigger to select files.
    dictDefaultMessage: "Drop or Upload your files here!"
});

myDropzone.on("addedfile", function (file) {
    // Hookup the start button              
    toggleState(2);
//    myDropzone.enqueueFile(file);
//    file.previewElement.querySelector(".start").onclick = function () {
//        
//    };
});

// Update the total progress bar
myDropzone.on("totaluploadprogress", function (progress) {
    $('#total-progress .progress-bar').css('width', progress + '%');
});

myDropzone.on("sending", function (file) {
    // Show the total progress bar when upload starts
    document.querySelector("#total-progress").style.opacity = "1";
    // And disable the start button
    file.previewElement.querySelector(".start").setAttribute("disabled", "disabled");
});

// Hide the total progress bar when nothing's uploading anymore
myDropzone.on("queuecomplete", function (progress) {
    document.querySelector("#total-progress").style.opacity = "0";
});

// Setup the buttons for all transfers
// The "add files" button doesn't need to be setup because the config
// `clickable` has already been specified.
//            document.querySelector("#actions .start").onclick = function () {
//                myDropzone.enqueueFiles(myDropzone.getFilesWithStatus(Dropzone.ADDED));
//            };
//            document.querySelector("#actions .cancel").onclick = function () {
//                myDropzone.removeAllFiles(true);
//            };

myDropzone.on('removedfile', function () {
    if (myDropzone.getAcceptedFiles().length == 0) {
        toggleState(0);
    }
});