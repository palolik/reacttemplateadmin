import { useParams } from "react-router-dom";
import { base_url } from "../../../config/config";

const OrderLabel = () => {
  const { orderId } = useParams();
  const previewUrl = `${base_url}/labelpdf/${orderId}?inline=true`;
  const downloadUrl = `${base_url}/labelpdf/${orderId}`;

  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="w-full bg-gray-100 border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <p className="text-sm text-gray-500 font-medium">Shipping Label Preview</p>
        <a
          href={downloadUrl}
          className="flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-gray-700 transition"
        >
          🖨️ Download / Print Label
        </a>
      </div>
      <iframe src={previewUrl} title="Shipping Label" className="flex-1 w-full border-0" />
    </div>
  );
};

export default OrderLabel;
