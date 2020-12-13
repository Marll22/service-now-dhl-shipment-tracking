function($scope) {
  /* widget controller */
  var c = this;	
	c.submitCode = function () {
		c.server.update()
	}
	c.refreshStatus = function () {
		c.data.refresh = true
		c.server.update().then(function () {
			c.data.refresh = false;
		})

	}
	c.toggleTrackingEvents = function (shipment) {
  	if (!shipment.show_events) {
			shipment.show_events = true
		
		} else {
			shipment.show_events = false

		}
		

	}
	
	
	
}