import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faExternalLinkAlt,
  faExclamationCircle,
  faSave,
  faQuestionCircle,
  faStar,
  faSignOutAlt,
  faEdit,
  faMinusSquare,
} from '@fortawesome/free-solid-svg-icons';

const initFontAwesome = () => {
  library.add(faExternalLinkAlt);
  library.add(faExclamationCircle);
  library.add(faSave);
  library.add(faQuestionCircle);
  library.add(faStar);
  library.add(faSignOutAlt);
  library.add(faEdit);
  library.add(faMinusSquare);
};

export default initFontAwesome;
