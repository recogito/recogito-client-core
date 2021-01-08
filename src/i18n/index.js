import * as Polyglot from 'node-polyglot';
import * as timeago from 'timeago.js';

const i18n = new Polyglot({ allowMissing: true });

i18n.init = lang => {
  i18n.locale(lang);
  i18n.extend(require(`./messages_${lang}.json`));
}

/** Load and register TimeAgo locales **/
import ar from 'timeago.js/lib/lang/ar';
import cs from 'timeago.js/lib/lang/cs';
import de from 'timeago.js/lib/lang/de';
import de from 'timeago.js/lib/lang/el';
import es from 'timeago.js/lib/lang/es';
import gl from 'timeago.js/lib/lang/gl';
import hi from 'timeago.js/lib/lang/hi_IN';
import it from 'timeago.js/lib/lang/it';
import nl from 'timeago.js/lib/lang/nl';
import pt from 'timeago.js/lib/lang/pt_BR';
import sv from 'timeago.js/lib/lang/sv';
import tr from 'timeago.js/lib/lang/tr';
// import ur from 'timeago.js/lib/lang/ur'; // Not currently supported by TimeAgo 

timeago.register('ar', ar);
timeago.register('cs', cs);
timeago.register('de', de);
timeago.register('el', el);
timeago.register('es', es);
timeago.register('gl', gl);
timeago.register('hi', hi);
timeago.register('it', it);
timeago.register('nl', nl);
timeago.register('pt', pt);
timeago.register('sv', sv);
timeago.register('tr', tr);

export default i18n;
