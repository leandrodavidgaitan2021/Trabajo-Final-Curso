$(document).ready(function () {
  // Obteniendo archivo JSON con las traduciones de las habilidades de los pokemon
  let habilidadesTraducidas = {};
  // Lee el archivo JSON almacenado en GitHub
  $.getJSON(
    "https://api.github.com/repos/leandrodavidgaitan2021/datos_json/contents/habilidades.json",
    function (data) {
      const content = atob(data.content); // Decodificar el contenido base64
      habilidadesTraducidas = JSON.parse(content);
    }
  ).fail(function (jqXHR, textStatus, errorThrown) {
    console.error("Error al cargar el archivo JSON:", textStatus, errorThrown);
  });

  // URL de la API de Pokémon
  let apiUrl = "https://pokeapi.co/api/v2/pokemon";
  // Realizar la solicitud GET a la API
  $.get(apiUrl, function (data) {
    let resultados = data.results;
    let pokemonLista = $("#pokemonLista");

    // Itera sobre los resultados y crear un article para cada personaje
    $.each(resultados, function (index, pokemon) {
      let pokemonUrl = pokemon.url;
      $.get(pokemonUrl, function (detalle) {
        let pokemonNombre = detalle.name;
        let pokemonImagen = detalle.sprites.front_default;

        // Crear el article para el personaje
        let article = `
                <div class="col-6 col-md-3 d-flex align-items-center justify-content-center">
                  <div class="card m-2" style="width: 12rem;">
                    <img src="${pokemonImagen}" class="card-img-top" alt="${pokemonNombre}">
                    <div class="card-body text-center">
                        <p class="card-text">${pokemonNombre.toUpperCase()}</p>
                    </div>
                  </div>
                </div>
                `;

        // Agregar el article al contenedor pokemonList
        pokemonLista.append(article);
      });
    });
  });

  // Realiza la busquead de un personaje en la API para sacar los datos individuales
  $("#searchForm").submit(function (event) {
    event.preventDefault(); // Prevenir el envío por defecto del formulario

    const pokemonName = $("#buscarPersonaje").val().trim().toLowerCase();

    if (pokemonName === "") {
      alert("Por favor, ingresa un nombre de Pokémon válido.");
      return;
    }

    // Realizar la solicitud a la API utilizando jQuery
    const buscar = `${apiUrl}/${pokemonName}`;
    $.get(buscar)
      .done(function (data) {
        displayPokemon(data); // Mostrar los datos del Pokémon encontrado
      })
      .fail(function () {
        console.error("Error al buscar el Pokémon.");
        alert("No se encontró el Pokémon. Inténtalo de nuevo.");
      });
  });

  // Función para mostrar los datos del Pokémon
  function displayPokemon(data) {
    // Mostrar las habilidades del Pokémon con traducción desde un JSON cargado en mi GITHUB
    const habilidades = data.abilities.map((abilityInfo) => {
      const nombreHabilidad = abilityInfo.ability.name;
      const habilidadTraducida =
        habilidadesTraducidas[nombreHabilidad] || nombreHabilidad;
      return habilidadTraducida;
    });

    let cardDiv = $("<div>").addClass("card m-1");
    let imagen = $("<img>")
      .addClass("card-img-top w-50 mx-auto")
      .attr({
        src: data.sprites.front_default,
        alt: `Imagen de ${
          data.name.charAt(0).toUpperCase() + data.name.slice(1)
        }`,
      });
    let cardBody = $("<div>").addClass("card-body");
    let nombre = $("<h5>")
      .addClass("card-title text-center")
      .text(data.name.charAt(0).toUpperCase() + data.name.slice(1));
    let detallesLista = $("<ul>")
      .addClass("list-group")
      .append(
        $("<li>")
          .addClass("list-group-item")
          .text("Altura: " + data.height / 10 + " m"),
        $("<li>")
          .addClass("list-group-item")
          .text("Peso: " + data.weight / 10 + " kg"),
        $("<li>")
          .addClass("list-group-item")
          .text("Habilidades: " + habilidades.join(", "))
      );

    // Construir la tarjeta de Pokémon
    cardBody.append(nombre, detallesLista);
    cardDiv.append(imagen, cardBody);

    // Vaciar el contenedor antes de añadir la nueva tarjeta
    $("#pokemonCardContainer").empty();

    // Añadir la tarjeta al contenedor en el DOM
    $("#pokemonCardContainer").append(cardDiv);
  }
});
