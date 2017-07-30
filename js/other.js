function showInfo(){} // Turn showInfo() into global function
$(document).ready(function(){
	$('#js-select').on('change', function(e){
		e.preventDefault();
		$('.content').show();
		$('#js-tbody').html('');
		jsContent = $('#js-content').offset().top;
		// ajax get JSON data
		$.ajax({
			type: 'GET',
			url: 'https://tcgbusfs.blob.core.windows.net/blobfs/GetDisasterSummary.json',
			success: function(data){
				thisData = data.DataSet['diffgr:diffgram'].NewDataSet.CASE_SUMMARY;
				infowindow = new google.maps.InfoWindow();
        var map;
        marker = [];
			// Check select value then create init map
			for(i=0; i<thisData.length; i++){
				if($('#js-select').val() === thisData[i].CaseLocationDistrict) {
				 var latlng = new google.maps.LatLng(thisData[i].Wgs84Y, thisData[i].Wgs84X);
	     	 var myOptions = {
	            zoom: 13,
	            center: latlng
	        	};
				}
				else if ($('#js-select').val() === '全區'){
					var latlng = new google.maps.LatLng(thisData[i].Wgs84Y, thisData[i].Wgs84X);
	     		var myOptions = {
	            zoom: 11,
	            center: latlng
	        	};
				}
			}
        // Create map
	      map = new google.maps.Map($("#map")[0], myOptions); // End of default google map
				for(i=0; i<thisData.length; i++){
					area=thisData[i].CaseLocationDistrict;
					address=thisData[i].CaseLocationDescription;
					description=thisData[i].CaseDescription;
	        name=thisData[i].PName;
	        caseTime = thisData[i].CaseTime;
	        caseSN = thisData[i].CaseSN;
	        onclickJs = "showInfo(map, marker[" + i + "])";
			    result = '<tr><td>' + caseTime + '</td><td><span class="btn btn-xs bg-primary">' + area + '</span></td><td><a href="#'+caseSN+'"onClick="' + onclickJs + '" style="cursor:pointer;"><span class="glyphicon glyphicon-map-marker"></span></a></td><td>' + description + '</td></tr>';
	        // Search area info
					if($('#js-select').val() === area) {
						$('#js-tbody').append(result);
						$('label').text('');
						// Add new markers
						marker[i] = new google.maps.Marker({
                  position: new google.maps.LatLng(thisData[i].Wgs84Y,thisData[i].Wgs84X),
                  map: map,
                  title: name, address, caseSN
             			});
						// Open infowindow event
						google.maps.event.addListener(marker[i], 'click', function(){
							showInfo(map, this);
				    }); // End of area addListener
					} // End of Area Search
	        // Search All info
					else if($('#js-select').val() === '全區') {
						var allArea = '全區最新動態';
						$('#js-tbody').append(result);
						$('label').text(allArea);
						marker[i] = new google.maps.Marker({
				                  position: new google.maps.LatLng(thisData[i].Wgs84Y,thisData[i].Wgs84X),
				                  map: map,
				                  title: name, address, caseSN
				              	});
				   	google.maps.event.addListener(marker[i], 'click', function(){
							showInfo(map, this);
					  }); // End of area addListener
					}; // End of else if
						showInfo = function(mapObj, markerObj) { // Open infowindow function
						  infowindow.setContent(infoContent(markerObj));
						  infowindow.open(mapObj, markerObj);
						  $('html, body').animate({
								scrollTop: jsContent
							}, 350);
						} // End of showInfo
						var infoContent = function(markerObj) { // Setting infowindow content function
						   html = '<ul id="' + markerObj.caseSN + '" style="list-style:none;"><li>名稱: '+ markerObj.title +'</li>';
						   html += '<li>詳細位置: '+ markerObj.address +'</li></ul>';
						   return html;
						}	// End of infoContent
				}// End of for
			} // End of success
		}); // End of $.ajax
		// Select change scrollTo js-content
		$('html, body').delay(650).animate({
			scrollTop: jsContent
		}, 350);
		// GoTop function
		$('.gotop').on('click',function(){
			$('html, body').animate({
				scrollTop: 0
			}, 350);
			$('.banner').css('min-height', '100vh');
		});
		// Window scroll event
		$(window).scroll(function(){
			var top = $(window).scrollTop();
			if(top>(jsContent-20)){
				$('.gotop').stop().fadeIn(200);
				$('.select').css({
					position: 'fixed',
					top: '0',
					left: '0',
					width: '100%',
					height: '70px',
					background: '#222'
				});
			}
			else {
				$('.gotop').stop().fadeOut(100);
				$('.select').css({
					position: 'static',
					background: 'transparent'
				});
			}
		}); // End of window scroll
	}); // End of onChange event
}); // End of document.ready
