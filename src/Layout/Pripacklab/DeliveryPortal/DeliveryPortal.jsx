import { TbTruckDelivery } from 'react-icons/tb';
import EmbeddedPortal from '../EmbeddedPortal/EmbeddedPortal';

// Embeds PriPackLab's shop portal on CC Delivery: book, track and manage
// parcels, labels and delivery finances.
const DeliveryPortal = () => (
  <EmbeddedPortal
    title="Delivery Portal"
    subtitle="Book, track and manage parcels with CC Delivery"
    icon={TbTruckDelivery}
    linkPath="/admin/deliveryportallink"
    messageType="cc-delivery:theme"
    notConfigured="The delivery portal is not configured on the server."
  />
);

export default DeliveryPortal;
