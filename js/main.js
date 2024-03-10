$(document).ready(function () {
    $('#autocomplete').autocomplete({
        lookup: songs.map(song => ({ value: song.title })),
        onSelect: function (obj) {
            var display = obj.value;
            $('#autocomplete').attr('placeholder', display);

            // Display paths for the selected song
            var song = songs.find(s => s.title === display);
            displayPath('Guitar', song.paths.guitar, 'outputG');

            // Make output boxes visible
            document.getElementById('outputG').style.display = 'block';
        }
    });
});


function displayPath(instrument, path, outputId) {
    // Replace commas with line breaks
    var formattedPath = path.path.replace(/,/g, "<br>");

    // Color code G (green) and R (red) characters
    formattedPath = formattedPath.replace(/G/g, '<span style="color: green;">G</span>');
    formattedPath = formattedPath.replace(/R/g, '<span style="color: red;">R</span>');
    formattedPath = formattedPath.replace(/Y/g, '<span style="color: yellow;">Y</span>');
    formattedPath = formattedPath.replace(/B/g, '<span style="color: blue;">B</span>');
    formattedPath = formattedPath.replace(/O/g, '<span style="color: orange;">O</span>');



    var display = `<strong>${instrument} Path:</strong><br>${formattedPath}`;
    if (path.notes !== "") {
        display += `<br/>&emsp;<strong>Notes:</strong> ${path.notes}`;
    }
    $(`#${outputId}`).html(display);
}




function SelectAll(id) {
    document.getElementById(id).focus();
    document.getElementById(id).select();
}

function OnLoad() {
    document.getElementById('tDisplay').innerHTML = songs.length;

    document.getElementById('gDisplay').innerHTML = "GUITAR PATHS: " + gLength;

}


function SelectAll(id) {
    document.getElementById(id).focus();
    document.getElementById(id).select();
}

function OnLoad() {
    document.getElementById('tDisplay').innerHTML = songs.length;

    document.getElementById('gDisplay').innerHTML = "GUITAR PATHS: " + gLength;

}

