import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import {bulkOperation} from "~/routes/webhookProcess/bulkOperation";
import {orderCreate} from "~/api/order.server";
import {createRefund} from "~/api/refunds.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, session, admin, payload, webhookId } = await authenticate.webhook(request);

  if (!admin) {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    throw new Response();
  }

  switch (topic) {
    case "APP_UNINSTALLED":
      if (session) {
        await db.session.deleteMany({ where: { shop } });
      }

      break;
    case "BULK_OPERATIONS_FINISH":
      await bulkOperation(shop, payload, admin)
      break;

    case "REFUNDS_CREATE":
      await createRefund(payload)
      break;

    case "ORDERS_CREATE":
      await orderCreate(shop, payload)
      break;
    case "CUSTOMERS_DATA_REQUEST":
    case "CUSTOMERS_REDACT":
    case "SHOP_REDACT":
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
