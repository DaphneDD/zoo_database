function filterAnimalByClass() {
    //get selected class
    var class_name = document.getElementById('animal_filter').value
    //construct the URL and redirect to it
    window.location = '/animals/filter/' + encodeURI(class_name)
}
