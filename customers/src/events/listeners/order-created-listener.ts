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
import { natsWrapper } from "../../nats-wrapper";
import { CustomerUpdatedPublisher } from "../publishers/customer-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
   subject: SubjectsEnum.OrderCreated = SubjectsEnum.OrderCreated;
   queueGroupName = QueueGroup.Customers;
   async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
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
         quantity: data.quantity,
         driver_paid: data.driver_paid,
         warehouse_paid: data.warehouse_paid,
         customer_id: data.customer_id,
         chow_details: chow,
         chow_id: data.chow_id || undefined,
      };

      const order = Order.build(newOrderPayload);

      await order.save();

      const customer = await Customer.findOne({ id: data.customer_id });

      await Customer.findOneAndUpdate(
         { id: data.customer_id },
         { orders: [...customer!.orders!, order] }
      );

      await customer?.save();

      console.log({ order, customer });
      msg.ack();
   }
}
