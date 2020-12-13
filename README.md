# DHL Shipment Tracking Widget

This widget gives Service Portal users the ability to track DHL shipments using a DHL tracking code. The widget makes a call to the DHL API and stores the shipment data in two tables: one for shipments and one for tracking events. The shipment is then displayed in the portal.

In the current version, shipment status has to be manually refreshed. There is a Refresh button available for this in the widget, as well as a similar UI action in the platform side.

The current version offers no ability to delete past shipments from the widget. This has to be done from the platform side.

In order to use the DHL API, you need to sign up at developer.dhl.com and get an API key. The API used is Shipment Tracking - Unified. Enter the API key in the Get Shipment HTTP method's HTTP Header (Name: DHL-Api-Key).

<a href="https://developer.servicenow.com/connect.do#!/share/contents/6393610_dhl_shipment_tracking_widget?t=PRODUCT_DETAILS" target="_blank">View in Share</a>