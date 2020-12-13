var DHL_Utils = Class.create();
DHL_Utils.prototype = {
	initialize: function () {},

	getShipmentData: function (trackingCode) {
		try {
			var r = new sn_ws.RESTMessageV2('DHL Shipment API', 'Get Shipment');
			r.setQueryParameter('trackingNumber', trackingCode);
			var response = r.execute();
			var responseBody = response.getBody();
			var httpStatus = response.getStatusCode();
			var jsonResponse = JSON.parse(responseBody);
			if (httpStatus != 200) {
				gs.addInfoMessage(jsonResponse['detail']);
				gs.error(JSUtil.logObject(jsonResponse));
				return;
			}
			return jsonResponse;
		} catch (ex) {
			var message = ex.message;
			gs.error(message);
		}
	},

	createShipment: function (shipmentData) {
		var shipment = new GlideRecord('u_shipments');
		shipment.initialize();
		if (shipment.get('u_id', shipmentData.shipments[0].id)) {
			shipment.get('u_id', shipmentData.shipments[0].id);
		}
		shipment.u_user = gs.getUserID();
		shipment.u_id = shipmentData.shipments[0].id;
		shipment.u_product = shipmentData.shipments[0].details.product.productName;
		shipment.u_nr_of_pieces = shipmentData.shipments[0].details.totalNumberOfPieces;
		shipment.u_weight = shipmentData.shipments[0].details.weight.value ? shipmentData.shipments[0].details.weight.value.toString() + " " + shipmentData.shipments[0].details.weight.unitText : ""
		shipment.u_status = shipmentData.shipments[0].status.status;
		shipment.u_status_code = shipmentData.shipments[0].status.statusCode;
		shipment.u_origin = this._convertCountryCode(shipmentData.shipments[0].origin.address.countryCode);
		shipment.u_destination = this._convertCountryCode(shipmentData.shipments[0].destination.address.countryCode);
		shipment.u_current_location = shipmentData.shipments[0].status.location.address.addressLocality;
		if (JSUtil.notNil(shipment.sys_id)) {
			shipment.sys_updated_on = new GlideDateTime();
			return shipment.update()
		} else {
			return shipment.insert();
		}
	},

	createTrackingEvents: function (shipmentData, shipmentID) {
		var event = new GlideRecord('u_dhl_tracking_events');
		var events = shipmentData.shipments[0].events;
		for (e in events) {
			if (event.get('u_timestamp', this._convertToGlideDate(events[e].timestamp))) {
				// do nothing
			} else {
				event.initialize();
				event.u_timestamp = this._convertToGlideDate(events[e].timestamp);
				event.u_location = events[e].location.address.addressLocality;
				event.u_status_code = events[e].statusCode;
				event.u_status = events[e].status;
				event.u_shipment = shipmentID;
				event.insert();
			}
		}

	},

	_convertCountryCode: function (countryCode) {
		var country = new GlideRecord('core_country');
		country.get('iso3166_2', countryCode);
		return country.name.toString();
	},

	_convertToGlideDate: function (date) {
		var datetime = date.replace(/T/, " ");
		datetime = datetime.replace(/Z/, "");
		var result = new GlideCalendarDateTime(datetime);
		return result;
	},

	type: 'DHL_Utils'
};