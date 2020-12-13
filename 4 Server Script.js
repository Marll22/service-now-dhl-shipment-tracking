(function() {

if (input) {
	if (input.tracking_code) {
	fetchShipments(input.tracking_code)
		displayShipments()
	}
	
else if (input.refresh) {
	var shipmentGR = new GlideRecord('u_shipments');
  shipmentGR.addQuery('sys_created_by', gs.getUserName());
	shipmentGR.query();
	while (shipmentGR.next()) {
	fetchShipments(shipmentGR.u_id.toString())
	}
	displayShipments()
 }	
	} else {
			displayShipments()
	}


function fetchShipments(trackingCode) {
var DHL = new DHL_Utils();
	try {
var shipmentData = DHL.getShipmentData(trackingCode)
if (!shipmentData) {
	return;
}
var shipmentID = DHL.createShipment(shipmentData)
DHL.createTrackingEvents(shipmentData, shipmentID)
} catch(err) {
	console.log(err);
}
	}	
	
function displayShipments() {	
data.shipments = []
var shipmentGR = new GlideRecord('u_shipments');
shipmentGR.addQuery('sys_created_by', gs.getUserName());
	shipmentGR.query();
	while (shipmentGR.next()) {
	var shipment = {}
	shipment.tracking_events = []
		// Don't show tracking events by default if there is more than one shipment
		if (shipmentGR.getRowCount() > 1) {
				shipment.show_events = false;
		} else {
			shipment.show_events = true;
		}
	$sp.getRecordDisplayValues(shipment, shipmentGR, 'sys_updated_on, sys_id, u_id, u_product, u_weight, u_status_code')
	var trackingEventGR = new GlideRecord('u_dhl_tracking_events')
	trackingEventGR.addQuery('u_shipment', shipmentGR.sys_id.toString())
	trackingEventGR.orderByDesc('u_timestamp');
	trackingEventGR.query();
	while (trackingEventGR.next()) {
		var trackingEvent = {}
		$sp.getRecordDisplayValues(trackingEvent, trackingEventGR, 'u_status, u_status_code, u_timestamp, u_location')
		shipment.tracking_events.push(trackingEvent)
	}
	data.shipments.push(shipment)
}
	}
	



})();