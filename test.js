export const DelhiveryScanWebhook = async (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization header missing"
            });
        }


        if (authHeader !== process.env.DELHIVERY_WEBHOOK_SECRET) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }


        console.log("CONTENT TYPE:", req.headers["content-type"]);
        console.log("BODY:", req.body);

        const { Shipment } = req.body || {};

        console.log("Shipment:", Shipment);
        // froword order
        if (!Shipment || !Shipment.Status) {
            return res.status(400).json({ success: false, message: "Invalid webhook payload" });
        }

        if (Shipment.StatusType == "UD" && Shipment.Status == "Manifested") {
            await orderModel.findOneAndUpdate({ waybill: Shipment.AWB }, { $set: { status: "pending" } }, { returnDocument: 'after' });
        }

        if (Shipment.StatusType == "UD" && Shipment.Status == "Not Picked") {
            await orderModel.findOneAndUpdate({ waybill: Shipment.AWB }, { $set: { status: "pending" } }, { returnDocument: 'after' });
        }

        if (Shipment.StatusType == "UD" && Shipment.Status == "In Transit") {
            await orderModel.findOneAndUpdate({ waybill: Shipment.AWB }, { $set: { status: "processing" } }, { returnDocument: 'after' });
        }


        if (Shipment.StatusType == "UD" && Shipment.Status == "Pending") {
            await orderModel.findOneAndUpdate({ waybill: Shipment.AWB }, { $set: { status: "shipped" } }, { returnDocument: 'after' });
        }

        if (Shipment.StatusType == "UD" && Shipment.Status == "Dispatched") {
            await orderModel.findOneAndUpdate({ waybill: Shipment.AWB }, { $set: { status: "out_for_delivery" } }, { returnDocument: 'after' });
        }

        if (Shipment.StatusType == "DL" && Shipment.Status == "Delivered") {
            const order = await orderModel.findOneAndUpdate({ waybill: Shipment.AWB }, { $set: { status: "delivered", completeAt: new Date() } }, { returnDocument: 'after' });
            if (order.payment.method == "cod") {
                await orderModel.findByIdAndUpdate(order._id, { $set: { "payment.status": "paid" } }, { returnDocument: "after" });
            }
        }


        //rto status 
        if (Shipment.StatusType == "RT" && Shipment.Status == "In Transit") {
            const rtoData = {
                status: Shipment.Status,
                completeAt: null
            }
            await orderModel.findOneAndUpdate({ waybill: Shipment.AWB }, { $set: { status: "cancelled", type: "rto", rtoData } }, { returnDocument: 'after' });
        }


        if (Shipment.StatusType == "RT" && Shipment.Status == "Pending") {
            const rtoData = {
                status: Shipment.Status,
                completeAt: null
            }
            await orderModel.findOneAndUpdate({ waybill: Shipment.AWB }, { $set: { rtoData } }, { returnDocument: 'after' });
        }

        if (Shipment.StatusType == "RT" && Shipment.Status == "Dispatched") {
            const rtoData = {
                status: Shipment.Status,
                completeAt: null
            }
            await orderModel.findOneAndUpdate({ waybill: Shipment.AWB }, { $set: { rtoData } }, { returnDocument: 'after' });
        }


        if (Shipment.StatusType == "DL" && Shipment.Status == "RTO") {
            const rtoData = {
                status: Shipment.Status,
                completeAt: new Date()
            }
            await orderModel.findOneAndUpdate({ waybill: Shipment.AWB }, { $set: { rtoData } }, { returnDocument: 'after' });
        }



        // customer return 

        if (Shipment.StatusType == "PP" && Shipment.Status == "Open") {
            await orderModel.findOneAndUpdate({ "returnData.waybill": Shipment.AWB }, { $set: { "returnData.status": "pending" }, type: "return" }, { returnDocument: 'after' });
        }


        if (Shipment.StatusType == "PP" && Shipment.Status == "Scheduled") {
            await orderModel.findOneAndUpdate({ "returnData.waybill": Shipment.AWB }, { $set: { "returnData.status": Shipment.Status } }, { returnDocument: 'after' });
        }


        if (Shipment.StatusType == "PP" && Shipment.Status == "Dispatched") {
            await orderModel.findOneAndUpdate({ "returnData.waybill": Shipment.AWB }, { $set: { "returnData.status": Shipment.Status } }, { returnDocument: 'after' });
        }

        if (Shipment.StatusType == "PU" && Shipment.Status == "In Transit") {
            const order = await orderModel.findOneAndUpdate({ "returnData.waybill": Shipment.AWB }, { $set: { "returnData.status": Shipment.Status } }, { returnDocument: 'after' });

            if (order.payment.method === "razorpay" && order.payment.status === "paid") {
                const refundResult = await RazorpayRefundApi(order);
                const refundData = {
                    method: "razorpay",
                    status: "pending",
                    refundId: refundResult?.id || "",
                };
                await orderModel.findByIdAndUpdate(order._id, { $set: { "returnData.refundData": refundData } }, { returnDocument: 'after' });
            }

        }


        if (Shipment.StatusType == "PU" && Shipment.Status == "Pending") {
            await orderModel.findOneAndUpdate({ "returnData.waybill": Shipment.AWB }, { $set: { "returnData.status": "In Transit" } }, { returnDocument: 'after' });
        }

        if (Shipment.StatusType == "PU" && Shipment.Status == "Dispatched") {
            await orderModel.findOneAndUpdate({ "returnData.waybill": Shipment.AWB }, { $set: { "returnData.status": Shipment.Status } }, { returnDocument: 'after' });
        }



        if (Shipment.StatusType == "DL" && Shipment.Status == "DTO") {
            await orderModel.findOneAndUpdate({ "returnData.waybill": Shipment.AWB }, { $set: { "returnData.status": Shipment.Status, "returnData.completeAt": new Date() } }, { returnDocument: 'after' });
        }

        if (Shipment.StatusType == "CN" && Shipment.Status == "Canceled") {
            await orderModel.findOneAndUpdate({ "returnData.waybill": Shipment.AWB }, { $set: { "returnData.status": Shipment.Status } }, { returnDocument: 'after' });
        }

        if (Shipment.StatusType == "CN" && Shipment.Status == "Closed") {
            await orderModel.findOneAndUpdate({ "returnData.waybill": Shipment.AWB }, { $set: { "returnData.status": Shipment.Status } }, { returnDocument: 'after' });
        }

        return res.status(200).json({ success: true, message: "Webhook received successfully" });
    } catch (error) {
        return next(error);
    }

}