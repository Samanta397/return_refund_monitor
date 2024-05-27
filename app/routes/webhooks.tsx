import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import {bulkOperation} from "~/routes/webhookProcess/bulkOperation";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, session, admin, payload, webhookId } = await authenticate.webhook(request);

  console.log('WEBOOOKS')
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
      console.log('BULK_OPERATIONS_FINISH', webhookId)
      await bulkOperation(shop, payload, admin)
      break;
    case "CUSTOMERS_DATA_REQUEST":
    case "CUSTOMERS_REDACT":
    case "SHOP_REDACT":
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
