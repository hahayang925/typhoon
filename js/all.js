function showInfo(){} // Turn showInfo() into global function

$(document).ready(function(){


  //ajax資料 列出目前所有區域
		$.ajax({
			type: 'GET',
			url: 'https://tcgbusfs.blob.core.windows.net/blobfs/GetDisasterSummary.json',
			success: function(data){
				setData = data.DataSet['diffgr:diffgram'].NewDataSet.CASE_SUMMARY;
        //console.log(setData);
        //select meun
        var areaList=[];
        for(var i=0; setData.length>i ;i++){
          areaList.push(setData[i].CaseLocationDistrict);
        }

        var area =[];
        areaList.forEach(function(value) {
          if (area.indexOf(value) == -1) {
              area.push(value);
          }
      })
      function updateList(){
        var msg='';
        for(i=0; i<area.length;i++){
          msg+= '<option value="'+ area[i] + '">'+ area[i] + '</option>';
        }document.querySelector('.select-dis').innerHTML= '<option value="選擇" disabled selected>--請選擇行政區--</option>' +'<option value="全區">全區</option>'+ msg;
        document.querySelector('.list-m').innerHTML= '<option value="選擇" disabled selected>--請選擇行政區--</option>' +'<option value="全區">全區</option>'+ msg;
      }
      updateList();
      //end of select menu

      //google api map
      var map;
      map = new google.maps.Map(document.getElementById('map'), {
       center: {lat:25.0387398, lng: 121.5416911},
        zoom: 13
        });
    }//success function

    })//ajax function



    $('.select-dis').on('change',function(e){
      e.preventDefault();
      //automatic turn to map section
      $('html,body').animate({scrollTop:$('#map').offset().top} , 700);
      $.ajax({
  			type: 'GET',
  			url: 'https://tcgbusfs.blob.core.windows.net/blobfs/GetDisasterSummary.json',
  			success: function(data){
  				 setData = data.DataSet['diffgr:diffgram'].NewDataSet.CASE_SUMMARY;
           infowindow = new google.maps.InfoWindow();
          var map;
           marker = [];
          for(i=0; i<setData.length; i++){
    				if($('.select-dis').val() === setData[i].CaseLocationDistrict) {
    				 var latlng = new google.maps.LatLng(setData[i].Wgs84Y, setData[i].Wgs84X);
    	     	 var mapOptions = {
    	            zoom: 13,
    	            center: latlng,
                  panControl: true,
                  zoomControl: true,
                  zoomControlOptions:{
                    style:google.maps.ZoomControlStyle.LARGE,
                    position:google.maps.ControlPosition.LEFT_CENTER
                  },
                  streetViewControl:true,
                  streetViewControlOptions:{
                    position:google.maps.ControlPosition.LEFT_CENTER
                  },
                  mapTypeControl:true,
                    mapTypeControlOptions:{
                      style:google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                      position:google.maps.ControlPosition.LEFT_BOTTOM
                    }

    	        	};
    				}
    				else if ($('.select-dis').val() === '全區'){
    					var latlng = new google.maps.LatLng(setData[i].Wgs84Y, setData[i].Wgs84X);
    	     		var mapOptions = {
    	            zoom: 11,
    	            center: latlng
                  panControl: true,
                  zoomControl: true,
                  zoomControlOptions:{
                    style:google.maps.ZoomControlStyle.LARGE,
                    position:google.maps.ControlPosition.LEFT_CENTER
                  },
                  streetViewControl:true,
                  streetViewControlOptions:{
                    position:google.maps.ControlPosition.LEFT_CENTER
                  },
                  mapTypeControl:true,
                    mapTypeControlOptions:{
                      style:google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                      position:google.maps.ControlPosition.LEFT_BOTTOM
                    }

    	        	};
    				}
    			}
            // init map
    	      map = new google.maps.Map($("#map")[0], mapOptions);

      var msg='';
      for(i=0;i<setData.length;i++){
        var district= setData[i].CaseLocationDistrict;
        var time = setData[i].CaseTime;
        var description = setData[i].CaseDescription;
        var address=setData[i].CaseLocationDescription;
        var onclickAct = "showInfo(map, marker[" + i + "])";
        var caseNum = setData[i].CaseSN;
        var name = setData[i].PName;
        if(setData[i].CaseLocationDistrict==$('.select-dis').val()){

          msg+= '<tr><td><h3>'+ district + '</h3></td>';
          msg+= '<td>'+ time + '</td>';
          msg+= '<td>'+ description + '</td>';
          msg+= '<td><a href="#'+ caseNum + '"onClick="showInfo(map, marker[' + i + '])"><img src="img/location.svg" alt="location"></a></td></tr>';

           marker[i] =new google.maps.Marker({
                   position: new google.maps.LatLng(setData[i].Wgs84Y, setData[i].Wgs84X),
                   map: map,
                   title: name, address
                 });
                 google.maps.event.addListener(marker[i], 'click', function() {
                   showInfo(map, this);
                 });

        }else if($('.select-dis').val()=='全區'){
          //var district= setData[i].CaseLocationDistrict;
          //var time = setData[i].CaseTime;
          //var description = setData[i].CaseDescription;
          msg+= '<tr><td><h3>'+ district + '</h3></td>';
          msg+= '<td>'+ time + '</td>';
          msg+= '<td>'+ description + '</td>';
          msg+= '<td><a href="#"><img src="img/location.svg" alt="location"></a></td></tr>';

           marker[i] =new google.maps.Marker({
                   position: new google.maps.LatLng(setData[i].Wgs84Y, setData[i].Wgs84X),
                   map: map,
                   title: name, address
                 });
           google.maps.event.addListener(marker[i], 'click', function() {
             showInfo(map, this);
           });
        }//end of else if
        showInfo = function(mapObj, markerObj) { // Open infowindow function
          infowindow.setContent(infoContent(markerObj));
          infowindow.open(mapObj, markerObj);
          $('html,body').animate({scrollTop:$('.wrap').offset().top},500);
        } // End of showInfo
        var infoContent = function(markerObj) { // Setting infowindow content function
           string = '<ul id="' + markerObj.caseSN + '" style="list-style:none;"><li>災情種類: '+ markerObj.title +'</li>';
           string += '<li>詳細位置: '+ markerObj.address +'</li></ul>';
           return string;
        }	// End of infoContent
      } //end of for

        document.querySelector('.details-content').innerHTML=msg;
        $('.content').show();

              }//end of success
            });//end of ajax
         //map = new google.maps.Map($("#map")[0], myOptions);
    })//change event

    $('.list-m').on('change',function(){
     var value = $('.list-m').val();
      $('.select-dis').val(value);
     })

    $(window).scroll(function(){
      var scrollPos = $(window).scrollTop();
      if(scrollPos > $('#map').offset().top-20){
        $('.list-m').show();
      }else{
        $('.list-m').hide();
      }

    })

})//ready function
