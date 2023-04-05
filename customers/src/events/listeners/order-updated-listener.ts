import {
   Listener,
   OrderUpdatedEvent,
   QueueGroup,
   SubjectsEnum,
} from "@cream-paws-util/common";
import { Message } from "node-nats-streaming";
import { Chow } from "../../models/chow";

import { Customer } from "../../models/customer";
import { Order } from "../../models/order";

export class OrderUpdatedListener extends Listener<OrderUpdatedEvent> {
   subject: SubjectsEnum.OrderUpdated = SubjectsEnum.OrderUpdated;
   queueGroupName = QueueGroup.Customers;

   async onMessage(data: OrderUpdatedEvent["data"], msg: Message) {
      const customer = await Customer.findOne({
         id: data.customer_id,
      });
      const order = await Order.findOne({
         id: data.id,
      });
      const chow = await Chow.findOne({ id: data.chow_id });

      const updatedOrderPayload = {
         id: data.id,
         version: data.version,
         delivery_date: data.delivery_date,
         payment_made: data.payment_made,
         payment_date: data.payment_date,
         is_delivery: data.is_delivery,
         quantity: data.quantity,
         driver_paid: data.driver_paid,
         warehouse_paid: data.warehouse_paid,
         customer_id: data.customer_id,
         chow_id: data.chow_id,
         chow_details: chow,
      };

      if (!order) {
         throw new Error("Order not found, check ID or version number");
      }

      if (!chow) {
         throw new Error("Chow not found, please check ID or version number");
      }

      if (!customer) {
         throw new Error("Customer not found, check ID or version number");
      }

      if (!customer.orders) {
         throw new Error("This customer has no orders attached to it.");
      }

      await order.updateOne(updatedOrderPayload);

      let foundOrderIndex = customer.orders?.findIndex(
         (customerOrder) => customerOrder.id === data.id
      );

      if (foundOrderIndex === -1 || foundOrderIndex === undefined) {
         throw new Error("Order Index not found, check ID or version number");
      }

      await Customer.findOneAndUpdate(
         { "orders.id": data.id },
         { "orders.$": updatedOrderPayload }
      );

      msg.ack();
   }
}
