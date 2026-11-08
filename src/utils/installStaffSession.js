// Imported first in main.jsx: the router starts its loaders as soon as it is
// created, so the staff session has to be in place before routes are imported.
import { installStaffSession } from "./staffSession";

installStaffSession();
