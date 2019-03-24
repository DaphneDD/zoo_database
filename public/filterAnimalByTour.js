function filterAnimalByTour() {
    //get selected tour 
    var tour = document.getElementById('animal_tour_filter').value
    //construct the URL and redirect to it
    window.location = '/animal_tour/filter/' + parseInt(tour)
}