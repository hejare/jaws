// import { NextApiRequest, NextApiResponse } from "next";
// import { ResponseDataType } from "../../../../../db/ResponseDataMeta";
// import { takeProfitSellOrder } from "../../../../../services/alpacaService";

// // TODO sell rename this
// interface ExtendedResponseDataType extends ResponseDataType {
//   orders?: Record<string, any>;
// }

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   const { query, method } = req;
//   const { ticker } = query;

//   try {
//     const responseData: ExtendedResponseDataType = { status: "INIT" };
//     switch (method) {
//       // THIS SHOULD BE TRIGGERED BY our JAWS SERVER WHEN VALUE HAS INCREASED BY 10%.
//       case "GET":
//         if (ticker && !(ticker instanceof Array)) {
//           await takeProfitSellOrder(ticker)
//             .then(() => {
//               responseData.status = "OK";
//             })
//             .catch((e) => {
//               responseData.status = "NOK";
//               responseData.message = e.message;
//             });
//         }
//         // todo sell update DB
//         break;
//       default:
//         throw new Error(`Unsupported method: ${method as string}`);
//     }
//     res.status(200).json(responseData);
//   } catch (e) {
//     let message;
//     if (e instanceof Error) {
//       message = e.message;
//       if (typeof e.message !== "string") {
//         message = e;
//       }
//     }
//     console.error(message);
//     return res.status(500).json({
//       error: message,
//     });
//   }
// }
