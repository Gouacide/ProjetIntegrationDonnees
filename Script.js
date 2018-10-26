var removeLayers = [];	<!-- Conteneur de nos futurs Pins-->
		
		var mymap = L.map('mapid').setView([48.864716, 2.349014], 12);
		 
		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox.streets'
		}).addTo(mymap);
		
		<!-- Liste des réalisateurs -->
		fetch('https://opendata.paris.fr/api/records/1.0/search/?dataset=tournagesdefilmsparis2011&facet=realisateur&facet=organisme_demandeur&facet=type_de_tournage&facet=ardt')
		  .then(
			function(response) {
			  if (response.status !== 200) {
				console.log('Looks like there was a problem. Status Code: ' +
				  response.status);
				return;
			  }
		
			response.json().then(function(data) {
				var i;
				for(i=0; i<data.facet_groups[0].facets.length; i++){
				var node = document.createElement("OPTION");                 // Create a <li> node -->
				var textnode = document.createTextNode(data.facet_groups[0].facets[i].name);         // Create a text node
				node.appendChild(textnode);                              // Append the text to <li> -->
				document.getElementById("myList").appendChild(node); 
				}
			});
			}
		  );	

		function showFilmByReal(){
			var real = document.getElementById('myList').value;
			var splitter = real.replace(" ","+");
			//var prenom = splitter[0]
			//var nom = splitter[1]
			
			fetch('https://opendata.paris.fr/api/records/1.0/search/?dataset=tournagesdefilmsparis2011&facet=realisateur&facet=ardt&refine.realisateur='+splitter)
		  .then(
			function(response) {
			  if (response.status !== 200) {
				console.log('Looks like there was a problem. Status Code: ' +
				  response.status);
				return;
			  }

			  // Examine the text in the response
			  response.json().then(function(data) {
				var i;
				for(i=0; i<data.records.length; i++){
					if(data.records[i].geometry){
						var one = data.records[i].geometry.coordinates[0]
						var two = data.records[i].geometry.coordinates[1]
						var marker = L.marker([two,one]).addTo(mymap);
						mymap.addLayer(marker);
						removeLayers.push(marker);
						marker.bindPopup("<b>"+data.records[i].fields.titre+"</b><br>"+data.records[i].fields.realisateur).openPopup();
					}
				}
			  });
			}
		  );
		}
		
		function clearMarkers(){
			for (var i=0;i<removeLayers.length;i++) {  			
			   mymap.removeLayer(removeLayers[i]);  
			}
			removeLayers=[];
			} 