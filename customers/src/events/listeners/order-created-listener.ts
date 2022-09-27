import {
   Listener,
   OrderCreatedEvent,
   QueueGroup,
   SubjectsEnum,
} from "@cream-paws-util/common";
import { Message } from "node-nats-streaming";
import { Chow, ChowDoc } from "../../models/chow";

import { Customer } from "../../models/customer";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
   subject: SubjectsEnum.OrderCreated = SubjectsEnum.OrderCreated;
   queueGroupName = QueueGroup.Customers;

   async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
      const customer = await Customer.findById(data.customer_id);
      console.log({ data });

      if (!customer) {
         throw new Error("Customer not found, check ID or version number");
      }

      if (!customer.orders) {
         throw new Error("This customer has no orders attached to it.");
      }

      const chowQuery = await Chow.findOne({ id: data.chow_id });
      let chow;
      // TODO: fix this flow properly.
      if (chowQuery) {
         chow = Chow.build({
            id: chowQuery.id,
            brand: chowQuery.brand,
            target_group: chowQuery.target_group,
            flavour: chowQuery.flavour,
            size: chowQuery.size,
            unit: chowQuery.unit,
            quantity: chowQuery.quantity,
            wholesale_price: chowQuery.wholesale_price,
            retail_price: chowQuery.retail_price,
            is_paid_for: chowQuery.is_paid_for,
         });

         await chow.save();
      } else {
         throw new Error("Chow not found, check ID");
      }

      const newOrderPayload = {
         id: data.id,
         version: data.version,
         delivery_date: data.delivery_date,
         payment_made: data.payment_made,
         payment_date: data.payment_date,
         is_delivery: data.is_delivery,
         driver_paid: data.driver_paid,
         warehouse_paid: data.warehouse_paid,
         customer_id: data.customer_id,
         chow_details: chow,
         chow_id: data.chow_id || undefined,
      };

      const order = Order.build(newOrderPayload);

      await order.save();

      console.log("saved order", order);
      // console.log({ order, ordersArray: [...customer.orders, order] });

      // TODO: check to see if it populates orderID on first order creation then sends proper order after
      customer.set({
         id: customer.id,
         name: customer.name,
         pets: customer.pets,
         orders: [...customer.orders, newOrderPayload],
      });

      await customer.save();

      // Testing for if we make a CustomerUpdatedPublisher
      console.log({ customer });

      msg.ack();
   }
}
