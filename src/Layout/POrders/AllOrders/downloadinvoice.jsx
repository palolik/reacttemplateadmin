import { base_url } from "../../../config/config";

export const downloadInvoice = (order) => {
  window.open(`${base_url}/invoicepdf/${order._id}`, "_blank");
};
