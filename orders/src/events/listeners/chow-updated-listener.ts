import {
   ChowCreatedEvent,
   ChowUpdatedEvent,
   Listener,
   QueueGroup,
   SubjectsEnum,
} from "@cream-paws-util/common";
import { Message } from "node-nats-streaming";
import { Chow } from "../../models/chow";
import { Order } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";
import { OrderUpdatedPublisher } from "../publishers/order-updated-publisher";

export class ChowUpdatedListener extends Listener<ChowUpdatedEvent> {
   subject: SubjectsEnum.ChowUpdated = SubjectsEnum.ChowUpdated;
   queueGroupName = QueueGroup.Orders;

   async onMessage(data: ChowCreatedEvent["data"], msg: Message) {
      const {
         id,
         brand,
         target_group,
         flavour,
         size,
         unit,
         quantity,
         wholesale_price,
         retail_price,
         is_paid_for,
      } = data;
      const chow = await Chow.findByEventVersion(data);

      if (!chow) {
         throw new Error("Chow not found");
      }

      chow.set({
         id,
         brand,
         target_group,
         flavour,
         size,
         unit,
         quantity,
         wholesale_price,
         retail_price,
         is_paid_for,
      });

      await chow.save();

      // TODO: Verify if this logic is needed
      // const orders = await Order.find({
      //    chow_being_ordered: chow.id,
      // });

      // if (!orders) {
      //    throw new Error("No orders found");
      // }

      // orders.map(async (order) => {
      //    order.set({
      //       id,
      //       brand,
      //       target_group,
      //       flavour,
      //       size,
      //       unit,
      //       quantity,
      //       wholesale_price,
      //       retail_price,
      //       is_paid_for,
      //    });

      //    new OrderUpdatedPublisher(natsWrapper.client).publish({
      //       id: order.id,
      //       delivery_date: order.delivery_date,
      //       version: order.version,
      //       payment_made: order.payment_made,
      //       payment_date: order.payment_date,
      //       is_delivery: order.is_delivery,
      //       driver_paid: order.driver_paid,
      //       warehouse_paid: order.warehouse_paid,
      //       customer_id: order.customer_id,
      //       chow_being_ordered: order.chow_being_ordered,
      //    });

      //    await order.save();
      // });

      msg.ack();
   }
}
