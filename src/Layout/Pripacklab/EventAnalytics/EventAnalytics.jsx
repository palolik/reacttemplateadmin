import { FiBarChart2 } from 'react-icons/fi';
import EmbeddedPortal from '../EmbeddedPortal/EmbeddedPortal';

// Embeds the CC Events view-only analytics dashboard.
const EventAnalytics = () => (
  <EmbeddedPortal
    title="Event Analytics"
    subtitle="Customer activity, popular products and categories"
    icon={FiBarChart2}
    linkPath="/admin/eventsdashboardlink"
    messageType="cc-events:theme"
    notConfigured="Event analytics is not configured on the server."
  />
);

export default EventAnalytics;
