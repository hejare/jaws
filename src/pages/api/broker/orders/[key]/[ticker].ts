import type { NextApiRequest, NextApiResponse } from "next";
import { ResponseDataType } from "../../../../../db/ResponseDataMeta";
import { isOnSameDate } from "../../../../../lib/helpers";
import {
  AlpacaOrderType,
  orderStatusesCompletedOk,
  orderStatusesInProgress,
  SUMMED_ORDER_STATUS,
} from "../../../../../services/alpacaMeta";
import { getOrdersByTicker } from "../../../../../services/alpacaService";
import { formatDateString } from "../../../../../util/handleFormatDateString";

interface ExtendedResponseDataType extends ResponseDataType {
  orderStatus?: SUMMED_ORDER_STATUS;
  orderDetails?: AlpacaOrderType;
  ordersOnThisDate?: AlpacaOrderType[];
}

function getSummedOrderStatus(unsortedOrders: AlpacaOrderType[]) {
  // Sort to have youngest order first in array:
  const orders = unsortedOrders.sort((a, b) =>
    b.created_at < a.created_at ? -1 : b.created_at > a.created_at ? 1 : 0,
  );

  const foundOrderCompleted = orders.find((o) =>
    orderStatusesCompletedOk.includes(o.status),
  );
  if (foundOrderCompleted) {
    return {
      orderStatus: SUMMED_ORDER_STATUS.FILLED,
      orderDetails: foundOrderCompleted,
    };
  }

  const foundOrderInProgress = orders.find((o) =>
    orderStatusesInProgress.includes(o.status),
  );
  if (foundOrderInProgress) {
    return {
      orderStatus: SUMMED_ORDER_STATUS.IN_PROGRESS,
      orderDetails: foundOrderInProgress,
    };
  }

  return {
    orderStatus: SUMMED_ORDER_STATUS.OPEN_FOR_PLACEMENT,
    orderDetails: orders.length > 0 ? orders[0] : undefined,
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { query, method } = req;
  const { key: date, ticker } = query;

  try {
    const responseData: ExtendedResponseDataType = { status: "INIT" };
    switch (method) {
      case "GET":
        if (
          ticker &&
          !(ticker instanceof Array) &&
          date &&
          !(date instanceof Array)
        ) {
          await getOrdersByTicker(ticker.toUpperCase())
            .then((orders) => {
              const datetime = `${formatDateString(date)} 00:00:00`;
              const ordersOnThisDate = orders.filter((order: AlpacaOrderType) =>
                isOnSameDate(datetime, order.created_at),
              );
              const { orderStatus, orderDetails } =
                getSummedOrderStatus(ordersOnThisDate);
              responseData.orderStatus = orderStatus;
              responseData.orderDetails = orderDetails;
              responseData.ordersOnThisDate = ordersOnThisDate;
              responseData.status = "OK";
            })
            .catch((e) => {
              responseData.status = "NOK";
              responseData.message = e.message;
            });
        }

        break;
      default:
        throw new Error(`Unsupported method: ${method as string}`);
    }
    res.status(200).json(responseData);
  } catch (e) {
    let message;
    if (e instanceof Error) {
      message = e.message;
      if (typeof e.message !== "string") {
        message = e;
      }
    }
    console.error(message);
    return res.status(500).json({
      error: message,
    });
  }
}
