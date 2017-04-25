(function() {
  'use strict';

  const movies = [];

  const renderMovies = function() {
    $('#listings').empty();

    for (const movie of movies) {
      const $col = $('<div>').addClass('col s6');
      const $card = $('<div>').addClass('card hoverable');
      const $content = $('<div>').addClass('card-content center');
      const $title = $('<h6>').addClass('card-title truncate');

      $title.attr({
        'data-position': 'top',
        'data-tooltip': movie.title
      });

      $title.tooltip({ delay: 50 }).text(movie.title);

      const $poster = $('<img>').addClass('poster');

      $poster.attr({
        src: movie.poster,
        alt: `${movie.poster} Poster`
      });

      $content.append($title, $poster);
      $card.append($content);

      const $action = $('<div>').addClass('card-action center');
      const $plot = $('<a>');

      $plot.addClass('waves-effect waves-light btn modal-trigger');
      $plot.attr('href', `#${movie.id}`);
      $plot.text('Plot Synopsis');

      $action.append($plot);
      $card.append($action);

      const $modal = $('<div>').addClass('modal').attr('id', movie.id);
      const $modalContent = $('<div>').addClass('modal-content');
      const $modalHeader = $('<h4>').text(movie.title);
      const $movieYear = $('<h6>').text(`Released in ${movie.year}`);
      const $modalText = $('<p>').text(movie.plot);

      $modalContent.append($modalHeader, $movieYear, $modalText);
      $modal.append($modalContent);

      $col.append($card, $modal);

      $('#listings').append($col);

      $('.modal-trigger').leanModal();
    }
  };

  function MovieObject(id, poster, title, year, plot){
    this.id = id;
    this.poster = poster;
    this.title = title;
    this.year = year;
    this.plot = plot;
  }

  $(document).ready(function() {

    console.log('Ready to Rock!');
    $("#submitBtn").click(function(event){
      event.preventDefault();
      $('#listings').empty();
      var $userSearch = $("#search").val();
        if ($userSearch === ''){
          window.alert("You need to enter a title to search...");
        } else {
          let $xhr = $.getJSON(`http://www.omdbapi.com/?s=${$userSearch}`);
          $xhr.done(function (data){
            // var moviePlot = "";
            // console.log(data);
            for (let i=0; i<data.Search.length; i++){
              let imdbId = data.Search[i].imdbID;
              // var moviePlot = null;
              let $yhr= $.getJSON(`http://www.omdbapi.com/?i=${imdbId}`);
              $yhr.done(function (idPlot){
                // console.log(idPlot);
                // moviePlot = idPlot.Plot;
                var movie = new MovieObject (idPlot.imdbID, idPlot.Poster, idPlot.Title, idPlot.Year, idPlot.Plot);
                console.log(movie);
                movies.push(movie);
                console.log(movies);
                renderMovies();
              });//closes $yhr
            }//closes for
              //  data.Search[i].Plot);
            $('#search').val("");//clears search input
          }); //closes $xhr.done
        }
      });//closes #searchBtn click
  });//closes document.ready
})();
