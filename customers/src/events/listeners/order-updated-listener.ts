import {
   Listener,
   OrderUpdatedEvent,
   QueueGroup,
   SubjectsEnum,
} from "@cream-paws-util/common";
import { Message } from "node-nats-streaming";

import { Customer } from "../../models/customer";

export class OrderUpdatedListener extends Listener<OrderUpdatedEvent> {
   subject: SubjectsEnum.OrderUpdated = SubjectsEnum.OrderUpdated;
   queueGroupName = QueueGroup.Customers;

   async onMessage(data: OrderUpdatedEvent["data"], msg: Message) {
      const customer = await Customer.findById(data.customer_id);

      if (!customer) {
         throw new Error("Customer not found, check ID or version number");
      }

      if (!customer.orders) {
         throw new Error("This customer has no orders attached to it.");
      }

      let foundOrderIndex = customer.orders?.findIndex(
         (order) => order.id === data.id
      );

      if (!foundOrderIndex) {
         throw new Error("Order not found, check ID or version number");
      }

      customer.orders[foundOrderIndex].set({
         id: data.id,
         version: data.version,
         delivery_date: data.delivery_date,
         payment_made: data.payment_made,
         payment_date: data.payment_date,
         is_delivery: data.is_delivery,
         driver_paid: data.driver_paid,
         warehouse_paid: data.warehouse_paid,
         customer_id: data.customer_id,
         chow_being_ordered: data.chow_being_ordered,
      });

      await customer.save();

      msg.ack();
   }
}
