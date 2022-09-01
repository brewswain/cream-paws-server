import {
   Listener,
   OrderCreatedEvent,
   QueueGroup,
   SubjectsEnum,
} from "@cream-paws-util/common";
import { Message } from "node-nats-streaming";
import { Chow } from "../../models/chow";

import { Customer } from "../../models/customer";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
   subject: SubjectsEnum.OrderCreated = SubjectsEnum.OrderCreated;
   queueGroupName = QueueGroup.Customers;

   async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
      const customer = await Customer.findById(data.customer_id);

      if (!customer) {
         throw new Error("Customer not found, check ID or version number");
      }

      if (!customer.orders) {
         throw new Error("This customer has no orders attached to it.");
      }

      // TODO: fix this flow properly.
      const chow = Chow.build({
         id: data.chow_being_ordered.id,
         brand: data.chow_being_ordered.brand,
         target_group: data.chow_being_ordered.target_group,
         flavour: data.chow_being_ordered.flavour,
         size: data.chow_being_ordered.size,
         unit: data.chow_being_ordered.unit,
         quantity: data.chow_being_ordered.quantity,
         wholesale_price: data.chow_being_ordered.wholesale_price,
         retail_price: data.chow_being_ordered.retail_price,
         is_paid_for: data.chow_being_ordered.is_paid_for,
         version: data.chow_being_ordered.version,
      });

      await chow.save();

      const order = Order.build({
         id: data.id,
         version: data.version,
         delivery_date: data.delivery_date,
         payment_made: data.payment_made,
         payment_date: data.payment_date,
         is_delivery: data.is_delivery,
         driver_paid: data.driver_paid,
         warehouse_paid: data.warehouse_paid,
         customer_id: data.customer_id,
         chow_being_ordered: chow,
      });

      console.log("saving order", data.id);
      await order.save();
      console.log("order saved!");

      customer.set({
         id: customer.id,
         name: customer.name,
         pets: customer.pets,
         orders: [...customer.orders, order],
      });

      let foundOrderIndex = customer.orders?.findIndex(
         (order) => order.id === data.id
      );

      console.log({ customer, data });
      await customer.save();

      msg.ack();
   }
}
