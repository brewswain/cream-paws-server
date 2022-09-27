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

      const updatedOrderPayload = {
         id: data.id,
         version: data.version,
         delivery_date: data.delivery_date,
         payment_made: data.payment_made,
         payment_date: data.payment_date,
         is_delivery: data.is_delivery,
         driver_paid: data.driver_paid,
         warehouse_paid: data.warehouse_paid,
         customer_id: data.customer_id,
         chow_id: data.chow_id,
         chow_details: data.chow_details,
      };
      console.log({ data, customer, order });

      if (!order) {
         throw new Error("ORder not found, check ID or version number");
      }

      if (!customer) {
         throw new Error("Customer not found, check ID or version number");
      }

      if (!customer.orders) {
         throw new Error("This customer has no orders attached to it.");
      }

      order.set(updatedOrderPayload);
      await order.save();

      console.log({ orders: customer.orders, data: data.id });

      let foundOrderIndex = customer.orders?.findIndex(
         (customerOrder) => customerOrder.id === data.id
      );

      console.log({ foundOrderIndex });
      if (!foundOrderIndex) {
         throw new Error("Order not found, check ID or version number");
      }

      const chow = await Chow.findById(data.chow_id);
      if (!chow) {
         throw new Error("Order not found, please check ID or version number");
      }

      customer.orders[foundOrderIndex].set(updatedOrderPayload);

      await customer.save();

      msg.ack();
   }
}
